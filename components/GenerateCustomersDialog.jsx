// components/GenerateCustomersDialog.jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const GenerateCustomersDialog = ({ onGenerate, isGenerating }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Random Müşteri Oluştur</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rastgele Müşteri Oluştur</DialogTitle>
                    <DialogDescription>
                        This will generate:
                        • 5-10 random customers
                        • At least 2 premium customers
                        • Random budgets between 500-3000 TL
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button onClick={onGenerate} disabled={isGenerating}>
                        {isGenerating ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GenerateCustomersDialog;
