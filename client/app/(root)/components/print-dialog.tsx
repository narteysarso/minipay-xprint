import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { PrintForm } from "./print-form"
import { usePrint } from "@/hooks/print-data-hook"
import { PrintFormSchema } from "@/data/schema";
import { Loader2 } from "lucide-react";
import { useMiniPay } from "@/hooks/minipay-provider";
import { parseUnits } from "viem";
import { useState } from "react";


import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
  } from "@/components/ui/alert-dialog"
  
  function AlertDialogInsufficientBalance({open, close}: {open: boolean, close: ()=>{}}) {
	return (
	  <AlertDialog open={open}>
		<AlertDialogContent>
		  <AlertDialogHeader>
			<AlertDialogTitle>Insufficient Balance</AlertDialogTitle>
			<AlertDialogDescription>
			 You Do not have enough balance for this transaction.
			 Top and try agina
			</AlertDialogDescription>
		  </AlertDialogHeader>
		  <AlertDialogFooter>
			<AlertDialogCancel onClick={close}>Cancel</AlertDialogCancel>
			<AlertDialogAction>
				<a href="https://minipay.opera.com/add_cash">Top up</a>
			</AlertDialogAction>
		  </AlertDialogFooter>
		</AlertDialogContent>
	  </AlertDialog>
	)
  }
  

export function PrintDialog() {
	const { formStep, formNextStep, formPrevStep, handlePrintSubmit, form, selectedPrinter, printFormData, printFormLoading } = usePrint();
	const {address, balance} = useMiniPay();
	const [showNotEnoughBalance, setShowNotEnoughBalance] = useState(false);

	const handleNextButtonClick = () => {
		try {
			const result = PrintFormSchema.parse(printFormData);
			const cost = parseUnits(result?.cost as string, parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS as string));
			// if(balance < cost) {
			// 	setShowNotEnoughBalance(true);
			// 	return;
			// }
			formNextStep()
		} catch (error) {
			console.log(error)
			form?.trigger();
		}

	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size={"sm"}>Print Doc</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Print Information</DialogTitle>
					<DialogDescription>
						Provide your printing information
					</DialogDescription>
				</DialogHeader>
				<AlertDialogInsufficientBalance open={showNotEnoughBalance} close={() => setShowNotEnoughBalance(false)} />
				<PrintForm />
				<DialogFooter>
					<div className="flex items-center justify-between align-reverse">
						{(formStep <= 2 && formStep > 1) &&
							<Button variant="default" onClick={formPrevStep}>Prev</Button>
						}
						{formStep == 1 && <Button variant="default" onClick={handleNextButtonClick}>Next</Button>}
						{
							formStep == 2 && <Button variant="default" onClick={() => { handlePrintSubmit() }} disabled={!selectedPrinter || printFormLoading}>
								{
									printFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
								}
								Print
							</Button>
						}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
