
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, Crown, Users, MapPin, BarChart3, Shield } from 'lucide-react';

interface SubscriptionPageProps {
  onBack: () => void;
}

const SubscriptionPage = ({ onBack }: SubscriptionPageProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    basic: {
      name: 'Basic Plan',
      icon: Users,
      features: [
        'Up to 3 farm branches',
        'Up to 50 animals per farm',
        'Basic health tracking',
        'Standard support',
        'Mobile app access'
      ],
      price: {
        monthly: 19,
        yearly: 190
      }
    },
    premium: {
      name: 'Premium Plan',
      icon: Crown,
      features: [
        'Unlimited farm branches',
        'Unlimited animals',
        'Advanced health analytics',
        'GPS animal tracking & mapping',
        'Priority support',
        'Custom reports & exports',
        'Veterinary consultation booking',
        'Advanced breeding management'
      ],
      price: {
        monthly: 49,
        yearly: 490
      }
    }
  };

  const currentPlan = plans[selectedPlan];
  const currentPrice = currentPlan.price[billingCycle];
  const yearlyDiscount = billingCycle === 'yearly' ? Math.round(((currentPlan.price.monthly * 12 - currentPlan.price.yearly) / (currentPlan.price.monthly * 12)) * 100) : 0;

  const handleSubscribe = () => {
    // This will be connected to Stripe checkout later
    console.log('Subscribe to:', selectedPlan, billingCycle, currentPrice);
    alert(`Subscription feature will be available once Supabase is connected for secure payment processing.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your farm management needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <RadioGroup value={billingCycle} onValueChange={(value: 'monthly' | 'yearly') => setBillingCycle(value)} className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="cursor-pointer py-2 px-4">Monthly</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly" className="cursor-pointer py-2 px-4 flex items-center">
                  Yearly 
                  <Badge variant="secondary" className="ml-2">Save up to 20%</Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(plans).map(([planKey, plan]) => {
            const isSelected = selectedPlan === planKey;
            const PlanIcon = plan.icon;
            
            return (
              <Card 
                key={planKey}
                className={`relative cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-green-500 shadow-lg scale-105' 
                    : 'hover:shadow-md hover:scale-102'
                }`}
                onClick={() => setSelectedPlan(planKey as 'basic' | 'premium')}
              >
                {planKey === 'premium' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      planKey === 'premium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <PlanIcon className={`w-8 h-8 ${
                        planKey === 'premium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-center mt-4">
                    <div className="text-4xl font-bold text-gray-900">
                      ${plan.price[billingCycle]}
                      <span className="text-lg font-normal text-gray-600">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && yearlyDiscount > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {yearlyDiscount}% with yearly billing
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Plan Summary & Subscribe Button */}
        <div className="max-w-md mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">Selected Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
                <p className="text-2xl font-bold text-green-600">
                  ${currentPrice}/{billingCycle === 'monthly' ? 'month' : 'year'}
                </p>
                {billingCycle === 'yearly' && yearlyDiscount > 0 && (
                  <p className="text-sm text-green-600">
                    You save ${currentPlan.price.monthly * 12 - currentPlan.price.yearly} per year!
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Subscribe to {currentPlan.name}
              </Button>
              
              <p className="text-xs text-gray-500 mt-2">
                Cancel anytime. No hidden fees.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-3 gap-0 border-b">
              <div className="p-4 font-semibold">Features</div>
              <div className="p-4 text-center font-semibold border-l">Basic</div>
              <div className="p-4 text-center font-semibold border-l bg-green-50">Premium</div>
            </div>
            
            {[
              { feature: 'Farm Branches', basic: '3', premium: 'Unlimited' },
              { feature: 'Animals per Farm', basic: '50', premium: 'Unlimited' },
              { feature: 'Health Tracking', basic: 'Basic', premium: 'Advanced Analytics' },
              { feature: 'GPS Mapping', basic: '❌', premium: '✅' },
              { feature: 'Custom Reports', basic: '❌', premium: '✅' },
              { feature: 'Vet Consultation', basic: '❌', premium: '✅' },
              { feature: 'Support', basic: 'Standard', premium: 'Priority' },
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-3 gap-0 border-b last:border-b-0">
                <div className="p-4">{row.feature}</div>
                <div className="p-4 text-center border-l">{row.basic}</div>
                <div className="p-4 text-center border-l bg-green-50">{row.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
