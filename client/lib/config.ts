import { 
    createConfig, 
    http, 
    cookieStorage,
    createStorage 
  } from 'wagmi'
  import { celo} from 'wagmi/chains'
  
  export function getConfig() {
    return createConfig({
        chains: [celo],
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
          }),
        transports: {
            [celo.id]: http()
        },
    })
  }