import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ParameterInput } from '@/components/ParameterInput';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Globe } from 'lucide-react';
import {
  LLMProvider,
  getLLMProviders,
  saveLLMSettings
} from '@/api/settings';
import { Separator } from '@/components/ui/separator';

export function LLMSettings() {
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [selectedCategory, setSelectedCategory] = useState('embedding');
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      const { providers } = await getLLMProviders();
      setProviders(providers);
    };
    loadSettings();
  }, []);

  const categoryProviders = providers.filter(p => p.category === selectedCategory);

  // Flatten models from all providers into a single array with provider info
  const availableModels = categoryProviders.flatMap(provider =>
    provider.models.map(model => ({
      ...model,
      providerId: provider.id,
      providerName: provider.name,
      baseUrl: provider.baseUrl,
      parameters: provider.parameters
    }))
  );

  const selectedModel = availableModels.find(m => m.id === selectedModelId);

  const handleSaveLLM = async () => {
    if (!selectedModel) return;

    try {
      await saveLLMSettings({
        provider: selectedModel.providerId,
        model: selectedModel.id,
        parameters
      });

      toast({
        title: 'Settings saved',
        description: 'Your LLM settings have been saved successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive'
      });
    }
  };

  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  const categories = ['embedding', 'reranking', 'reasoning', 'chat', 'realtime'];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Model Settings</h1>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category} Configuration</CardTitle>
                <CardDescription>Configure {category} model settings and parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label>Model Selection</Label>
                    <InfoTooltip content={`Select a model for ${category}`} />
                  </div>
                  <Select
                    value={selectedModelId}
                    onValueChange={(value) => {
                      setSelectedModelId(value);
                      setParameters({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableModels.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span>{model.providerName} - {model.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {model.description}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedModel && (
                  <>
                    <Separator />

                    <div className="space-y-6">
                      {selectedModel.parameters.map(param => (
                        <div key={param.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label>
                              {param.name}
                              {param.required && (
                                <span className="text-destructive ml-1">*</span>
                              )}
                            </Label>
                            <InfoTooltip content={param.description} />
                          </div>
                          <div className="ml-6">
                            {param.type === 'string' ? (
                              <Input
                                type={param.id.includes('key') ? 'password' : 'text'}
                                value={parameters[param.id]?.value || ''}
                                onChange={(e) =>
                                  handleParameterChange(param.id, {
                                    value: e.target.value
                                  })
                                }
                                className="max-w-md"
                              />
                            ) : param.type === 'number' ? (
                              <div className="max-w-md">
                                <ParameterInput
                                  label=""
                                  value={parameters[param.id]?.value ?? param.default}
                                  onChange={(value) =>
                                    handleParameterChange(param.id, {
                                      value
                                    })
                                  }
                                  min={param.min}
                                  max={param.max}
                                  step={param.step}
                                />
                              </div>
                            ) : (
                              <Switch
                                checked={parameters[param.id]?.value ?? param.default}
                                onCheckedChange={(checked) =>
                                  handleParameterChange(param.id, {
                                    value: checked
                                  })
                                }
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSaveLLM}>Save Settings</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}