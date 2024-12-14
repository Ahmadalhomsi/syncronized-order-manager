import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  Package 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// Mock data - in a real app, this would come from an API or database
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    customer: "John Doe",
    total: "$129.99",
    status: "Shipped",
    date: "2024-06-15"
  },
  {
    id: "ORD-002", 
    customer: "Jane Smith",
    total: "$79.50",
    status: "Processing",
    date: "2024-06-16"
  }
];

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r">
        <h1 className="text-2xl font-bold mb-6">Orders Dashboard</h1>
        <nav>
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2"
          >
            <LayoutDashboard className="mr-2" /> Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2"
          >
            <ShoppingCart className="mr-2" /> Orders
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2"
          >
            <Users className="mr-2" /> Customers
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start mb-2"
          >
            <Package className="mr-2" /> Products
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
          >
            <Settings className="mr-2" /> Settings
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$4,582.30</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">7</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_ORDERS.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>
                          <span 
                            className={`px-2 py-1 rounded ${
                              order.status === 'Shipped' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;