import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { LogoutConfirmModalProps } from '@/types/ui';

export function LogoutConfirmModal({ open, onOpenChange, onConfirm }: LogoutConfirmModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await onConfirm();
        } catch {
            // Logout mutation shows error toast; keep modal open
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (isLoggingOut && !next) return;
                onOpenChange(next);
            }}
        >
            <DialogContent
                className="bg-white rounded-3xl border border-accent-20 max-w-[440px] p-8"
                onPointerDownOutside={(e) => isLoggingOut && e.preventDefault()}
                onEscapeKeyDown={(e) => isLoggingOut && e.preventDefault()}
            >
                <DialogHeader>
                    <div className="mx-auto mb-4 flex items-center justify-center size-14 rounded-full bg-primary-100/10">
                        <LogOut className="size-7 text-primary-100" strokeWidth={2} />
                    </div>
                    <DialogTitle className="text-center text-2xl font-semibold text-secondary-000 leading-[1.3] mb-2">
                        Log Out?
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-accent-80 leading-6">
                        Are you sure you want to log out of your account?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-3 sm:flex-col mt-6">
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoggingOut}
                        className="w-full h-12 bg-primary-100 text-white rounded-full text-base font-semibold border-none cursor-pointer hover:bg-primary-100/90 disabled:opacity-70"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                Logging out...
                            </>
                        ) : (
                            'Yes, Log Out'
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoggingOut}
                        className="w-full h-12 bg-transparent text-secondary-000 rounded-full border-2 border-accent-20 text-base font-semibold cursor-pointer hover:bg-accent-10 disabled:opacity-50"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
