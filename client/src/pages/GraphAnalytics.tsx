import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InfoTooltip } from '@/components/InfoTooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { getAnalyticsSettings, saveAnalyticsSettings, reasoningTechniques } from '@/api/graph';
import { useEffect, useState } from 'react';
import { ParameterInput } from '@/components/ParameterInput';
import { Separator } from '@/components/ui/separator';

export function GraphAnalytics() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { settings } = await getAnalyticsSettings();
        setSettings(settings);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load analytics settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      await saveAnalyticsSettings(settings);
      toast({
        title: 'Success',
        description: 'Analytics settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    }
  };

  const updateCentralitySettings = (metric: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      centrality: {
        ...prev.centrality,
        [metric]: {
          ...prev.centrality[metric],
          [field]: value
        }
      }
    }));
  };

  const updateCommunitySettings = (algorithm: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      community: {
        ...prev.community,
        [algorithm]: {
          ...prev.community[algorithm],
          [field]: value
        }
      }
    }));
  };

  const updateReasoningSettings = (technique: string) => {
    const selectedTechnique = reasoningTechniques.find(t => t.id === technique);
    if (!selectedTechnique) return;

    const defaultParams = Object.fromEntries(
      selectedTechnique.parameters.map(p => [p.id, p.default])
    );

    setSettings((prev: any) => ({
      ...prev,
      reasoning: {
        selectedTechnique: technique,
        parameters: defaultParams
      }
    }));
  };

  const updateReasoningParameter = (paramId: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      reasoning: {
        ...prev.reasoning,
        parameters: {
          ...prev.reasoning.parameters,
          [paramId]: value
        }
      }
    }));
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  const selectedTechnique = reasoningTechniques.find(
    t => t.id === settings.reasoning.selectedTechnique
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Graph Analytics Settings</h1>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>

      <Tabs defaultValue="centrality" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="centrality">Centrality Analysis</TabsTrigger>
          <TabsTrigger value="community">Community Detection</TabsTrigger>
          <TabsTrigger value="reasoning">Reasoning Techniques</TabsTrigger>
        </TabsList>

        <TabsContent value="centrality">
          <Card>
            <CardHeader>
              <CardTitle>Centrality Metrics</CardTitle>
              <CardDescription>
                Configure various centrality metrics for node importance analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {Object.entries(settings.centrality).map(([metric, config]: [string, any]) => (
                    <div key={metric} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="capitalize">{metric} Centrality</Label>
                          <InfoTooltip content={`Configure ${metric} centrality settings`} />
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) =>
                            updateCentralitySettings(metric, 'enabled', checked)
                          }
                        />
                      </div>
                      {config.enabled && (
                        <div className="pl-6 space-y-4">
                          <ParameterInput
                            label="Threshold"
                            value={config.threshold}
                            onChange={(value) =>
                              updateCentralitySettings(metric, 'threshold', value)
                            }
                            min={0}
                            max={1}
                            step={0.1}
                          />
                          {config.iterations !== undefined && (
                            <ParameterInput
                              label="Iterations"
                              value={config.iterations}
                              onChange={(value) =>
                                updateCentralitySettings(metric, 'iterations', value)
                              }
                              min={10}
                              max={10000}
                              step={10}
                            />
                          )}
                        </div>
                      )}
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card>
            <CardHeader>
              <CardTitle>Community Detection</CardTitle>
              <CardDescription>
                Configure community detection algorithms and their parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {Object.entries(settings.community).map(([algorithm, config]: [string, any]) => (
                    <div key={algorithm} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label className="capitalize">{algorithm}</Label>
                          <InfoTooltip content={`Configure ${algorithm} algorithm settings`} />
                        </div>
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(checked) =>
                            updateCommunitySettings(algorithm, 'enabled', checked)
                          }
                        />
                      </div>
                      {config.enabled && (
                        <div className="pl-6 space-y-4">
                          {config.resolution !== undefined && (
                            <ParameterInput
                              label="Resolution"
                              value={config.resolution}
                              onChange={(value) =>
                                updateCommunitySettings(algorithm, 'resolution', value)
                              }
                              min={0.1}
                              max={5.0}
                              step={0.1}
                            />
                          )}
                          {config.minSize !== undefined && (
                            <ParameterInput
                              label="Minimum Community Size"
                              value={config.minSize}
                              onChange={(value) =>
                                updateCommunitySettings(algorithm, 'minSize', value)
                              }
                              min={2}
                              max={20}
                              step={1}
                            />
                          )}
                        </div>
                      )}
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reasoning">
          <Card>
            <CardHeader>
              <CardTitle>Reasoning Techniques</CardTitle>
              <CardDescription>
                Configure graph reasoning and exploration techniques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Reasoning Technique</Label>
                  <Select
                    value={settings.reasoning.selectedTechnique}
                    onValueChange={updateReasoningSettings}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technique" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasoningTechniques.map((technique) => (
                        <SelectItem key={technique.id} value={technique.id}>
                          <div className="flex flex-col">
                            <span>{technique.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {technique.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTechnique && (
                  <div className="space-y-4">
                    <Separator />
                    <h3 className="font-medium">Technique Parameters</h3>
                    <div className="pl-6 space-y-6">
                      {selectedTechnique.parameters.map((param) => (
                        <div key={param.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label>{param.name}</Label>
                            <InfoTooltip content={`Configure ${param.name.toLowerCase()}`} />
                          </div>
                          <ParameterInput
                            label=""
                            value={settings.reasoning.parameters[param.id]}
                            onChange={(value) => updateReasoningParameter(param.id, value)}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}