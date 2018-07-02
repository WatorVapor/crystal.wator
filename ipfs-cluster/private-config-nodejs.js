'use strict'

module.exports = () => ({
  Addresses: {
    API: '/ip4/127.0.0.1/tcp/25002',
    Gateway: '/ip4/127.0.0.1/tcp/29090'
  },
  Discovery: {
    MDNS: {
      Enabled: true,
      Interval: 10
    },
    webRTCStar: {
      Enabled: true
    }
  },
  Bootstrap: [
  ]
})
