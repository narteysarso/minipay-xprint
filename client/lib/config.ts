import { 
    createConfig, 
    http, 
    cookieStorage,
    createStorage 
  } from 'wagmi'
  import { celo, celoAlfajores, localhost } from 'wagmi/chains'
  
  export function getConfig() {
    return createConfig({
        chains: [celo, celoAlfajores, localhost],
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
          }),
        transports: {
            [celo.id]: http(),
            [celoAlfajores.id]: http(),
            [localhost.id]: http(),
        },
    })
  }