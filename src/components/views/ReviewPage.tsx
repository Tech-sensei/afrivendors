import { CheckCircle2, Calendar, Clock, MapPin, Mail, Phone, Download, CreditCard, Banknote } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import type { ReviewPageProps } from '@/types/misc';

export function ReviewPage({ onNavigate, vendor, service, services: servicesProp, date, time, name, email, phone, notes, paymentMethod = 'venue' }: ReviewPageProps) {
  const bookingServices = servicesProp || (service ? [service] : []);
  const totalPrice = bookingServices.reduce((sum, svc) => sum + (svc.priceValue || 0), 0);
  const formattedTotal = `₦${totalPrice.toLocaleString()}`;
  const bookingId = `AFV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  return (
    <div className="flex flex-col min-h-screen bg-accent-10">
      <section className="py-12 lg:py-20 flex-1">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-8 animate-in fade-in zoom-in duration-300">
            <div className="h-20 w-20 rounded-full flex items-center justify-center bg-primary-100/10">
              <CheckCircle2 className="h-12 w-12 text-primary-100" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
            <h2 className="mb-4 font-unbounded text-3xl lg:text-4xl font-semibold text-secondary-000">
              Booking Confirmed!
            </h2>
            <p className="font-unageo text-lg text-accent-80">
              Your appointment has been successfully scheduled
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
            <Card className="rounded-2xl overflow-hidden border border-accent-20">
              <CardContent className="p-0">
                {/* Booking Reference Header */}
                <div className="text-center py-6 px-6 bg-primary-300">
                  <p className="font-unageo text-xs text-accent-80 mb-2">
                    Booking Reference
                  </p>
                  <h3 className="font-unbounded text-2xl font-semibold text-secondary-000 tracking-wide">
                    {bookingId}
                  </h3>
                </div>

                <div className="p-6 lg:p-8 space-y-6">
                  {/* Vendor & Services */}
                  <div>
                    <h4 className="mb-4 font-unageo text-lg font-semibold text-secondary-000">
                      Appointment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-unageo text-base text-accent-80">
                          Vendor
                        </span>
                        <span className="text-right font-unageo text-base font-semibold text-secondary-000">
                          {vendor.name}
                        </span>
                      </div>

                      <Separator />

                      <div>
                        <span className="font-unageo text-base text-accent-80 mb-2 block">
                          Services
                        </span>
                        <div className="space-y-2">
                          {bookingServices.map((svc: any) => (
                            <div
                              key={svc.id}
                              className="flex justify-between items-start pl-4 py-2 rounded-lg bg-accent-10"
                            >
                              <span className="flex-1 font-unageo text-base text-secondary-000">
                                {svc.name}
                              </span>
                              <span className="ml-4 font-unageo text-base font-semibold text-secondary-100">
                                {svc.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Date & Time */}
                  <div>
                    <h4 className="mb-4 font-unageo text-lg font-semibold text-secondary-000">
                      When & Where
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-accent-80 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-unageo text-xs text-accent-80">
                            Date
                          </p>
                          <p className="font-unageo text-base text-secondary-000">
                            {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-accent-80 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-unageo text-xs text-accent-80">
                            Time
                          </p>
                          <p className="font-unageo text-base text-secondary-000">
                            {time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-accent-80 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-unageo text-xs text-accent-80">
                            Location
                          </p>
                          <p className="font-unageo text-base text-secondary-000">
                            {vendor.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Information */}
                  <div>
                    <h4 className="mb-4 font-unageo text-lg font-semibold text-secondary-000">
                      Payment Information
                    </h4>
                    <div
                      className={`p-4 rounded-lg ${paymentMethod === 'online' ? 'bg-green-50' : 'bg-primary-300'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {paymentMethod === 'online' ? (
                            <CreditCard className="h-5 w-5 text-green-700" />
                          ) : (
                            <Banknote className="h-5 w-5 text-primary-100" />
                          )}
                          <span className="font-unageo text-base font-semibold text-secondary-000">
                            {paymentMethod === 'online' ? 'Paid Online' : 'Pay at Venue'}
                          </span>
                        </div>
                        {paymentMethod === 'online' && (
                          <span className="px-3 py-1 rounded-full bg-green-700 text-white font-unageo text-xs font-semibold">
                            PAID
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-unageo text-base text-accent-80">
                          {paymentMethod === 'online' ? 'Amount Paid' : 'Amount to Pay'}
                        </span>
                        <span className="font-unbounded text-2xl font-bold text-secondary-100">
                          {formattedTotal}
                        </span>
                      </div>
                      {paymentMethod === 'venue' && (
                        <p className="mt-3 font-unageo text-xs text-accent-80">
                          Please pay with cash or card when you arrive at the venue
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div>
                    <h4 className="mb-4 font-unageo text-lg font-semibold text-secondary-000">
                      Your Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-primary-100">
                          <span className="text-white font-unbounded text-base font-bold">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-unageo text-base text-secondary-000 font-semibold">
                            {name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-accent-80 shrink-0" />
                        <p className="font-unageo text-base text-secondary-000">
                          {email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-accent-80 shrink-0" />
                        <p className="font-unageo text-base text-secondary-000">
                          {phone}
                        </p>
                      </div>
                      {notes && (
                        <div className="pt-3 border-t border-accent-20">
                          <p className="font-unageo text-xs text-accent-80 mb-1">
                            Special Requests
                          </p>
                          <p className="font-unageo text-base text-accent-80">
                            {notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-accent-20 space-y-3 bg-accent-10">
                  <Button
                    className="w-full bg-primary-100 text-white hover:bg-primary-100/90 rounded-xl h-12 font-unageo text-base font-semibold transition-all duration-300"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Confirmation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-accent-20 text-secondary-000 hover:bg-white rounded-xl h-12 font-unageo text-base font-semibold transition-all duration-300"
                    size="lg"
                    onClick={() => onNavigate('home')}
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Confirmation Note */}
            <div className="mt-6 p-4 rounded-lg text-center bg-primary-300">
              <p className="font-unageo text-base text-accent-80">
                A confirmation email has been sent to <span className="font-semibold text-secondary-000">{email}</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
