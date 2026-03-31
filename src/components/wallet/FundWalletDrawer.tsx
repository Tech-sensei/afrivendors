"use client";

import { useState, useEffect } from 'react';
import { Plus, CreditCard, Trash2, DollarSign } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import type { SavedCard, WalletFundDrawerProps as FundWalletDrawerProps } from '@/types/wallet';

export function FundWalletDrawer({
    isOpen,
    onClose,
    savedCards,
    onDeleteCard,
    onFundWallet,
}: FundWalletDrawerProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [fundAmount, setFundAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(savedCards[0]?.id || 'new');
    const [saveAsDefault, setSaveAsDefault] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    // Card form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = () => {
        if (!fundAmount || parseFloat(fundAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (paymentMethod === 'new') {
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                toast.error('Please fill in all card details');
                return;
            }

            onFundWallet(fundAmount, paymentMethod, {
                cardNumber,
                cardName,
                cardExpiry,
                cardCvv,
                saveAsDefault,
            });
        } else {
            onFundWallet(fundAmount, paymentMethod);
        }

        // Reset form
        setFundAmount('');
        setPaymentMethod(savedCards[0]?.id || 'new');
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
        setSaveAsDefault(false);
    };

    const isFormValid = () => {
        if (!fundAmount || parseFloat(fundAmount) <= 0) return false;
        if (paymentMethod === 'new') {
            return !!(cardNumber && cardName && cardExpiry && cardCvv);
        }
        return true;
    };

    const handleDeleteClick = (cardId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCardToDelete(cardId);
        setDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (cardToDelete) {
            onDeleteCard(cardToDelete);
            // If the deleted card was selected, switch to another card or 'new'
            if (paymentMethod === cardToDelete) {
                const remainingCards = savedCards.filter(card => card.id !== cardToDelete);
                setPaymentMethod(remainingCards[0]?.id || 'new');
            }
            setCardToDelete(null);
        }
    };

    const getCardToDeleteInfo = () => {
        if (!cardToDelete) return null;
        return savedCards.find(card => card.id === cardToDelete);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={`w-full sm:max-w-md flex flex-col border-0 p-0 ${isMobile
                        ? 'rounded-t-3xl max-h-[85vh]'
                        : 'rounded-l-3xl rounded-tr-none h-full'
                    }`}
            >
                <div className="flex-1 overflow-y-auto p-6">
                    <SheetHeader className="p-0">
                        <SheetTitle className="font-unbounded text-xl font-semibold text-secondary-000">
                            Fund Wallet
                        </SheetTitle>
                        <SheetDescription className="text-sm text-accent-80">
                            Add money to your Afrivendor wallet
                        </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6 px-0">
                        {/* Amount Section */}
                        <div>
                            <Label
                                htmlFor="fundAmount"
                                className="block mb-2 text-sm font-semibold text-secondary-000"
                            >
                                Enter Amount (GBP)
                            </Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent-60" />
                                <Input
                                    id="fundAmount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="h-12 pl-10 rounded-xl border-accent-20 text-base font-semibold"
                                />
                            </div>
                        </div>

                        {/* Payment Method Section */}
                        <div>
                            <Label className="block mb-3 text-sm font-semibold text-secondary-000">
                                Payment Method
                            </Label>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="space-y-2">
                                    {savedCards.map((card) => (
                                        <div
                                            key={card.id}
                                            className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${paymentMethod === card.id
                                                ? 'border-primary-100 bg-primary-100/5 border-2'
                                                : 'border-accent-20'
                                                }`}
                                        >
                                            <RadioGroupItem value={card.id} id={card.id} />
                                            <Label
                                                htmlFor={card.id}
                                                className="flex-1 cursor-pointer text-sm text-secondary-000"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-accent-60" />
                                                    <span>
                                                        {card.brand} •••• {card.lastFour}
                                                    </span>
                                                    {card.isDefault && (
                                                        <span className="text-xs font-semibold text-primary-100 bg-primary-100/10 px-2 py-0.5 rounded-md">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                            </Label>
                                            <button
                                                onClick={(e) => handleDeleteClick(card.id, e)}
                                                className="p-1.5 rounded-lg hover:bg-red-50 text-accent-60 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <div
                                        className={`flex items-center space-x-3 p-3 rounded-xl border transition-all ${paymentMethod === 'new'
                                            ? 'border-primary-100 bg-primary-100/5 border-2'
                                            : 'border-dashed border-accent-20'
                                            }`}
                                    >
                                        <RadioGroupItem value="new" id="new" />
                                        <Label
                                            htmlFor="new"
                                            className="flex-1 cursor-pointer text-sm text-secondary-000"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Plus className="h-4 w-4 text-primary-100" />
                                                <span>Add new card</span>
                                            </div>
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* New Card Fields */}
                        {paymentMethod === 'new' && (
                            <div className="space-y-4 pt-4 border-t border-accent-20">
                                <div>
                                    <Label
                                        htmlFor="fundCardNumber"
                                        className="block mb-2 text-sm font-semibold text-secondary-000"
                                    >
                                        Card Number
                                    </Label>
                                    <Input
                                        id="fundCardNumber"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        className="h-12 rounded-xl border-accent-20 text-sm"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="fundCardName"
                                        className="block mb-2 text-sm font-semibold text-secondary-000"
                                    >
                                        Cardholder Name
                                    </Label>
                                    <Input
                                        id="fundCardName"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="Name on card"
                                        className="h-12 rounded-xl border-accent-20 text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            htmlFor="fundCardExpiry"
                                            className="block mb-2 text-sm font-semibold text-secondary-000"
                                        >
                                            Expiry
                                        </Label>
                                        <Input
                                            id="fundCardExpiry"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(e.target.value)}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            className="h-12 rounded-xl border-accent-20 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label
                                            htmlFor="fundCardCvv"
                                            className="block mb-2 text-sm font-semibold text-secondary-000"
                                        >
                                            CVV
                                        </Label>
                                        <Input
                                            id="fundCardCvv"
                                            type="password"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value)}
                                            placeholder="123"
                                            maxLength={4}
                                            className="h-12 rounded-xl border-accent-20 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Checkbox
                                        id="saveCard"
                                        checked={saveAsDefault}
                                        onCheckedChange={(checked) => setSaveAsDefault(checked as boolean)}
                                    />
                                    <Label
                                        htmlFor="saveCard"
                                        className="cursor-pointer text-sm text-secondary-000"
                                    >
                                        Save this card for future use
                                    </Label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <SheetFooter className="flex-col gap-3 p-6 pt-4 border-t border-accent-20 bg-white sticky bottom-0 z-10">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full h-12 rounded-xl border-accent-20 text-sm font-semibold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className="w-full h-12 bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add £{fundAmount || '0.00'}
                    </Button>
                </SheetFooter>
            </SheetContent>

            {/* Delete Card Confirmation Modal */}
            <ConfirmModal
                open={deleteConfirmOpen}
                onOpenChange={setDeleteConfirmOpen}
                onConfirm={handleConfirmDelete}
                title="Delete Card?"
                description={`Are you sure you want to delete ${getCardToDeleteInfo()?.brand} •••• ${getCardToDeleteInfo()?.lastFour}? This action cannot be undone.`}
                confirmText="Yes, Delete"
                cancelText="Cancel"
                icon={Trash2}
                iconColor="text-red-600"
                iconBg="bg-red-50"
                confirmButtonVariant="destructive"
            />
        </Sheet>
    );
}

