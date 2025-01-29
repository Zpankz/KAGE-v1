import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Save, Upload, Download, Edit2, Trash2 } from "lucide-react";
import { SchemaForm } from "@/components/schema/SchemaForm";
import { SchemaGraph } from "@/components/SchemaGraph";
import { Topics } from "@/components/Topics";

export function Schema() {
  const [activeTab, setActiveTab] = useState("config");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Schema saved",
      description: "Your schema configuration has been saved successfully."
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Schema Configuration</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="viewer">Schema Viewer</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>
                  Configure basic schema settings and defaults
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Schema Name</Label>
                  <Input placeholder="Enter schema name" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Enter schema description" />
                </div>
                <div className="space-y-2">
                  <Label>Version</Label>
                  <Input placeholder="1.0.0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Schema Components</CardTitle>
                    <CardDescription>
                      Manage your knowledge graph entities and relations
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => {}}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button variant="outline" onClick={() => {}}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: '1', name: 'Person', type: 'Entity', topic: 'People', categories: ['Individual'], level: 'Basic' },
                      { id: '2', name: 'Located In', type: 'Relation', topic: 'Places', categories: ['Location'], level: 'Basic' }
                    ].map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.topic}</TableCell>
                        <TableCell>{item.categories.join(', ')}</TableCell>
                        <TableCell>{item.level}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viewer">
          <Card>
            <CardContent className="p-6">
              <SchemaGraph />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Topics />
        </TabsContent>
      </Tabs>
    </div>
  );
}