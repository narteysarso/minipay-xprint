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

export function PrintDialog() {
  const {formStep, formNextStep, formPrevStep, handlePrintJobSubmit} = usePrint();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Print Doc</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Print Information</DialogTitle>
          <DialogDescription>
            Provide your printing information
          </DialogDescription>
        </DialogHeader>
        <PrintForm />
        <DialogFooter>
          <div className="flex items-center justify-between align-reverse">
          {(formStep <= 2 && formStep > 1) && 
            <Button variant="default" onClick={formPrevStep}>Prev</Button>
          }
          {formStep ==1 && <Button variant="default" onClick={formNextStep}>Next</Button>}
          {
            formStep == 2 && <Button variant="default" onClick={handlePrintJobSubmit}>Print</Button>
          }
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
