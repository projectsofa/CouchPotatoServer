from couchpotato.core.logger import CPLog
from couchpotato.core.notifications.base import Notification
import base64
import urllib

log = CPLog(__name__)


class XBMC(Notification):

    def notify(self, message = '', data = {}):
        if self.isDisabled(): return

        for host in [x.strip() for x in self.conf('host').split(",")]:
            self.send({'command': 'ExecBuiltIn', 'parameter': 'Notification(CouchPotato, %s)' % message}, host)
            self.send({'command': 'ExecBuiltIn', 'parameter': 'XBMC.updatelibrary(video)'}, host)

        return True

    def send(self, command, host):

        url = 'http://%s/xbmcCmds/xbmcHttp/?%s' % (host, urllib.urlencode(command))

        headers = {}
        if self.password:
            headers = {
               'Authorization': "Basic %s" % base64.encodestring('%s:%s' % (self.conf('username'), self.conf('password')))[:-1]
            }

        if not self.urlopen(url, headers = headers):
            log.error("Couldn't sent command to XBMC")
            return False

        log.info('XBMC notification to %s successful.' % host)
        return True
