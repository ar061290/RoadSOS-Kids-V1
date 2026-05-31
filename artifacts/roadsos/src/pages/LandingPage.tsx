import { useState, useEffect } from "react";
import { useGetDashboardSummary, getGetDashboardSummaryQueryKey } from "@workspace/api-client-react";
import { Activity, ShieldAlert, HeartPulse, Clock, ActivitySquare } from "lucide-react";
import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const { data: summary } = useGetDashboardSummary({
    query: {
      refetchInterval: 5000,
      queryKey: getGetDashboardSummaryQueryKey(),
    }
  });

  return (
    <div className="min-h-screen bg-background mission-grid text-foreground flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-5xl space-y-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/30">
              <ShieldAlert size={40} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">RoadSoS Kids</h1>
          <p className="text-xl text-muted-foreground uppercase tracking-widest">Emergency Response System</p>
          
          <div className="flex justify-center mt-6">
            <Badge variant="outline" className="text-lg py-2 px-6 border-destructive/50 text-destructive bg-destructive/10 animate-pulse">
              <Activity className="w-5 h-5 mr-2" />
              {summary?.activeIncidents || 0} ACTIVE INCIDENTS
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          
          {/* Child Watch Panel */}
          <Link href="/child-watch" className="block group">
            <Card className="h-full border-2 border-border group-hover:border-primary/50 transition-colors bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
                  <ActivitySquare size={24} />
                </div>
                <CardTitle className="text-2xl">Child Watch</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Simulated smartwatch interface. Displays ETA, vitals alerts, and parent reassurance messages.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Parent Command Panel */}
          <Link href="/parent" className="block group">
            <Card className="h-full border-2 border-border group-hover:border-primary/50 transition-colors bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-4">
                  <HeartPulse size={24} />
                </div>
                <CardTitle className="text-2xl">Parent Command</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Live tracking of child status, ambulance routing, and real-time hospital ETA. Secure messaging.</p>
              </CardContent>
            </Card>
          </Link>

          {/* Responder Dashboard Panel */}
          <Link href="/responder" className="block group">
            <Card className="h-full border-2 border-border group-hover:border-destructive/50 transition-colors bg-card/80 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
                  <Clock size={24} />
                </div>
                <CardTitle className="text-2xl">Responder Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Mission-control view for paramedics. Incident state management, medical history, and live vitals.</p>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}
