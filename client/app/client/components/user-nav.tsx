'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";
import { useMiniPay } from "@/hooks/minipay-provider";
import { CopyIcon } from "@radix-ui/react-icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors"




export function UserNav() {

  const { address, balance } = useMiniPay();
  const { toast } = useToast()

  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { connect } = useConnect();


  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      // User is using MiniPay so hide connect wallet button.
      setHideConnectBtn(true);

      connect({ connector: injected({ target: "metaMask" }) });
    }
  }, []);

  return (
    <>
      {}
      {hideConnectBtn ?
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 rounded-full">
              <div className="flex items-center">
                <p>{balance} cUSD</p>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="@shadcn" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {`${address?.substr(0, 16)}...`} <Button variant="outline" size="icon" onClick={() => {
                    navigator.clipboard.writeText(address);
                    toast({
                      description: "Address copied to clipboard"
                    })
                  }}>
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        :
        <><ConnectButton showBalance /></>
      }
    </>
  )
}