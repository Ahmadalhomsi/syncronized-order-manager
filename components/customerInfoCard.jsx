import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserCircle, Wallet, Star, Clock, DollarSign, Award } from 'lucide-react';

const CustomerInfoCard = ({ customer }) => {
    if (!customer) return null;

    return (
        <Card className="w-full max-w-2xl mx-auto mb-6 bg-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-blue-500" />
                    {customer.customerName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-500">Available Budget</p>
                            <p className="font-semibold">{customer.budget} TL</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" />
                        <div>
                            <p className="text-sm text-gray-500">Customer Type</p>
                            <p className="font-semibold">{customer.customerType}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-yellow-500" />
                        <div>
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="font-semibold">{customer.totalSpent} TL</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-semibold">
                                {new Date(customer.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CustomerInfoCard;