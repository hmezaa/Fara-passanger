// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'http://104.248.138.97:3000/',
  // baseUrl: 'http://localhost:3000/',
  // baseUrl: 'http://104.248.138.97:3000/',
  // baseUrl: 'http://206.189.50.220:3000/',
  baseUrl: 'http://162.243.161.94:3000/', //new
  firebaseConfig: {
    apiKey: "AIzaSyB9Smq2Ul28oB0j5jhkcvBRStfny042fkU",
    authDomain: "taxiapp-4ba90.firebaseapp.com",
    projectId: "taxiapp-4ba90",
    storageBucket: "taxiapp-4ba90.appspot.com",
    messagingSenderId: "169453418778",
    appId: "1:169453418778:web:b284aae9ed9169b52c94a3",
    measurementId: "G-B2G7GLL5XC"
  }
  // firebaseConfig: {
  //   apiKey: "AIzaSyAQE4414J0nWkfOmat95t9TkEQ5XbgQZw8",
  //   authDomain: "fara-92cb6.firebaseapp.com",
  //   projectId: "fara-92cb6",
  //   storageBucket: "fara-92cb6.appspot.com",
  //   messagingSenderId: "438151650636",
  //   appId: "1:438151650636:web:3e7b2527d3e77094a583e9",
  //   measurementId: "G-QBZEHP3FTT"
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
