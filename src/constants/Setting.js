import config from "./Config.js";

export default {
    apiUrl: config.domain + '/api/v1/serviceprovider/',
    // dashboardUrl: config.domain + '/api/v1/serviceprovider/appposdashboard',
    dashboardUrl: config.domain + '/api/v1/serviceprovider/appdashboard',
    technicianSaleReportsUrl: config.domain + '/api/v1/serviceprovider/technician/sale-reports',
    salesreportUrl: config.domain + '/api/v1/serviceprovider/salesreport',
    smsmarketingUrl: config.domain + '/api/v1/serviceprovider/smsmarketingapp',
    clientStatisticUrl: config.domain + '/api/v1/serviceprovider/statistic-lient',
    jwtkey: 'tpn-auth',
    userkey: 'tpn-user',
    deviceid: 'tpn-deviceid',
    turnkey: 'tpn-turn',
    turnkeyday: 'tpn-turnday',
    language: 'tpn-language',
    //cardconnectEndPoint: 'fts.cardconnect.com:6443'
    cardconnectEndPoint: 'boltgw.cardconnect.com:8443'
};
