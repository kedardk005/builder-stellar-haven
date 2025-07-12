import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Database, Zap, Globe } from "lucide-react";

export const DemoRemovalNotice = () => {
  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <CardTitle className="text-green-800 dark:text-green-200">
            Live Project Connected!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-green-700 dark:text-green-300">
          🎉 All demo data has been removed and the project is now connected to
          live backend services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-green-600" />
            <div>
              <Badge
                variant="outline"
                className="text-green-700 border-green-300"
              >
                MongoDB Atlas
              </Badge>
              <p className="text-xs text-green-600 mt-1">
                Real database connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-600" />
            <div>
              <Badge
                variant="outline"
                className="text-green-700 border-green-300"
              >
                Live APIs
              </Badge>
              <p className="text-xs text-green-600 mt-1">
                All endpoints active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            <div>
              <Badge
                variant="outline"
                className="text-green-700 border-green-300"
              >
                Cloud Services
              </Badge>
              <p className="text-xs text-green-600 mt-1">
                Cloudinary & Razorpay ready
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
          <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            What's Now Live:
          </h4>
          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <li>✅ Real user authentication with JWT</li>
            <li>✅ Dynamic item listing from MongoDB</li>
            <li>✅ Image uploads to Cloudinary</li>
            <li>✅ Payment processing with Razorpay</li>
            <li>✅ Admin panel with real data management</li>
            <li>✅ Points system and rewards</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
