'use strict'

module.exports = () => ({
  Addresses: {
    Swarm: [
      '/ip4/127.0.0.1/tcp/24002',
      '/ip4/127.0.0.1/tcp/24003/ws'
    ],
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
