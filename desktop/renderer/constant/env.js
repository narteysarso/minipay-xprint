import dotenv from "dotenv";
dotenv.config({path: ".env"});


export const projectId = process.env.REACT_APP_WC_PROJECT_ID;
export const thirdweb_clientId = process.env.REACT_APP_THIRD_WEB_CLIENT_ID;
export const thirdweb_secret = process.env.REACT_APP_THIRD_WEB_SECRET;
export const cusdAddress = process.env.ENV === 'production' ? process.env.REACT_APP_CUSD_ADDRESS_CELO: process.env.REACT_APP_CUSD_ADDRESS_ALFAJORES;
export const web_rpc = process.env.ENV === 'production' ? process.env.REACT_APP_PROVIDER_URL_CELO: process.env.REACT_APP_PROVIDER_URL_ALFAJORES;
export const xprintAddress = process.env.ENV === 'production' ? process.env.REACT_APP_XPRINT_ADDRESS_CELO: process.env.REACT_APP_XPRINT_ADDRESS_ALFAJORES;