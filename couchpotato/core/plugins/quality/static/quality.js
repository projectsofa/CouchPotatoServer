var QualityBase = new Class({

	tab: '',
	content: '',

	setup: function(data){
		var self = this;

		self.qualities = data.qualities;

		self.profiles = {}
		Object.each(data.profiles, self.createProfilesClass.bind(self));

		App.addEvent('load', self.addSettings.bind(self))

	},

	getProfile: function(id){
		return this.profiles[id]
	},

	// Hide items when getting profiles
	getActiveProfiles: function(){
		return Object.filter(this.profiles, function(profile){
			return !profile.data.hide
		});
	},

	getQuality: function(id){
		return this.qualities.filter(function(q){
			return q.id == id;
		}).pick();
	},

	addSettings: function(){
		var self = this;

		self.settings = App.getPage('Settings')
		self.settings.addEvent('create', function(){
			var tab = self.settings.createTab('profile', {
				'label': 'Quality',
				'name': 'profile'
			});

			self.tab = tab.tab;
			self.content = tab.content;

			self.createProfiles();
			self.createProfileOrdering();
			self.createSizes();

		})

	},

	/**
	 * Profiles
	 */
	createProfiles: function(){
		var self = this;
		
		var non_core_profiles = Object.filter(self.profiles, function(profile){ return !profile.isCore() });
		var count = Object.getLength(non_core_profiles);

		self.settings.createGroup({
			'label': 'Quality Profiles',
			'description': 'Create your own profiles with multiple qualities.'
		}).inject(self.content).adopt(
			self.profile_container = new Element('div.container'),
			new Element('a.add_new_profile', {
				'text': count > 0 ? 'Create another quality profile' : 'Click here to create a quality profile.',
				'events': {
					'click': function(){
						var profile = self.createProfilesClass();
						$(profile).inject(self.profile_container)
					}
				}
			})
		);

		// Add profiles, that aren't part of the core (for editing)
		Object.each(non_core_profiles, function(profile){
			$(profile).inject(self.profile_container)
		});

	},

	createProfilesClass: function(data){
		var self = this;

		var data = data || {'id': randomString()}

		return self.profiles[data.id] = new Profile(data);
	},

	createProfileOrdering: function(){
		var self = this;

		var profile_list;
		var group = self.settings.createGroup({
			'label': 'Profile Defaults'
		}).adopt(
			new Element('.ctrlHolder#profile_ordering').adopt(
				new Element('label[text=Order]'),
				profile_list = new Element('ul'),
				new Element('p.formHint', {
					'html': 'Change the order the profiles are in the dropdown list. Uncheck to hide it completely.<br />First one will be default.'
				})
			)
		).inject(self.content)

		Object.each(self.profiles, function(profile){
			var check;
			new Element('li', {'data-id': profile.data.id}).adopt(
				check = new Element('input.inlay[type=checkbox]', {
					'checked': !profile.data.hide,
					'events': {
						'change': self.saveProfileOrdering.bind(self)
					}
				}),
				new Element('span.profile_label', {
					'text': profile.data.label
				}),
				new Element('span.handle')
			).inject(profile_list);

			new Form.Check(check);

		});

		// Sortable
		self.profile_sortable = new Sortables(profile_list, {
			'revert': true,
			'handle': '',
			'opacity': 0.5,
			'onComplete': self.saveProfileOrdering.bind(self)
		});

	},

	saveProfileOrdering: function(){
		var self = this;

		var ids = [];
		var hidden = [];

		self.profile_sortable.list.getElements('li').each(function(el, nr){
			ids.include(el.get('data-id'));
			hidden[nr] = +!el.getElement('input[type=checkbox]').get('checked');
		});

		Api.request('profile.save_order', {
			'data': {
				'ids': ids,
				'hidden': hidden
			}
		});

	},

	/**
	 * Sizes
	 */
	createSizes: function(){
		var self = this;

		var group = self.settings.createGroup({
			'label': 'Sizes',
			'description': 'Edit the minimal and maximum sizes (in MB) for each quality.',
			'advanced': true
		}).inject(self.content)


		new Element('div.item.head').adopt(
			new Element('span.label', {'text': 'Quality'}),
			new Element('span.min', {'text': 'Min'}),
			new Element('span.max', {'text': 'Max'})
		).inject(group)

		Object.each(self.qualities, function(quality){
			new Element('div.ctrlHolder.item').adopt(
				new Element('span.label', {'text': quality.label}),
				new Element('input.min', {'value': quality.size_min}),
				new Element('input.max', {'value': quality.size_max})
			).inject(group)
		});

	}

});

window.Quality = new QualityBase();
