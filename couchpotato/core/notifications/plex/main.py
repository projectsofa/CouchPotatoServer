from couchpotato.core.logger import CPLog
from couchpotato.core.notifications.base import Notification
from xml.dom import minidom

log = CPLog(__name__)


class Plex(Notification):

    def notify(self, message = '', data = {}):
        if self.isDisabled(): return

        log.info('Sending notification to Plex')
        hosts = [x.strip() for x in self.conf('host').split(",")]

        for host in hosts:

            source_type = ['movie']
            base_url = 'http://%s/library/sections' % host
            refresh_url = '%s/%%s/refresh' % base_url

            try:
                xml_sections = minidom.parse(self.urlopen(base_url))
                sections = xml_sections.getElementsByTagName('Directory')
                for s in sections:
                    if s.getAttribute('type') in source_type:
                        url = refresh_url % s.getAttribute('key')
                        x = self.urlopen(url)
            except:
                log.error('Plex library update failed for %s.' % host)

        return True
