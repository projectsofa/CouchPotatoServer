from .main import NZBGet

def start():
    return NZBGet()

config = [{
    'name': 'nzbget',
    'groups': [
        {
            'tab': 'downloaders',
            'name': 'nzbget',
            'label': 'NZBGet',
            'description': 'Send NZBs to your NZBGet installation.',
            'options': [
                {
                    'name': 'enabled',
                    'default': 0,
                    'type': 'enabler',
                },
                {
                    'name': 'host',
                    'default': 'localhost:6789',
                    'description': 'Hostname with port. Usually <strong>localhost:6789</strong>',
                },
                {
                    'name': 'password',
                    'description': 'Default NZBGet password is <i>tegbzn6789</i>',
                },
                {
                    'name': 'category',
                    'default': 'Movies',
                    'description': 'The category CP places the nzb in. Like <strong>movies</strong> or <strong>couchpotato</strong>',
                },
            ],
        }
    ],
}]
