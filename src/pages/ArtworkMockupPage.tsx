
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileImage, Palette, Image, ImagePlus, FileUp, Search } from "lucide-react";

const ArtworkMockupPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleUploadClick = () => {
    toast({
      title: "Upload initiated",
      description: "Artwork upload functionality will be implemented soon.",
    });
  };

  const handleCreateNewClick = () => {
    toast({
      title: "Create new artwork",
      description: "New artwork creation will be implemented soon.",
    });
  };

  const mockArtworks = [
    { id: 1, name: "Product Label Design", type: "Label", date: "2025-02-15", thumbnail: "/placeholder.svg" },
    { id: 2, name: "T-Shirt Mockup", type: "Apparel", date: "2025-03-01", thumbnail: "/placeholder.svg" },
    { id: 3, name: "Packaging Design", type: "Package", date: "2025-03-12", thumbnail: "/placeholder.svg" },
    { id: 4, name: "Banner Design", type: "Marketing", date: "2025-03-20", thumbnail: "/placeholder.svg" },
  ];

  const filteredArtworks = mockArtworks.filter(artwork => 
    artwork.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artwork.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Artwork & Mockup</h1>
          <div className="flex gap-2">
            <Button onClick={handleUploadClick}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button variant="default" onClick={handleCreateNewClick}>
              <ImagePlus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
        </div>

        <Tabs defaultValue="artwork" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="artwork">
              <FileImage className="mr-2 h-4 w-4" />
              Artwork
            </TabsTrigger>
            <TabsTrigger value="mockups">
              <Image className="mr-2 h-4 w-4" />
              Mockups
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Palette className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search artwork or mockups..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="artwork" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={artwork.thumbnail} 
                      alt={artwork.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg">{artwork.name}</CardTitle>
                    <CardDescription>{artwork.type} • {artwork.date}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex justify-between">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button variant="default" size="sm">Edit</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mockups" className="mt-0">
            <div className="text-center p-8">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No Mockups Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your first mockup by clicking the "Create New" button above.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-0">
            <div className="text-center p-8">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Templates Coming Soon</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                We're working on adding templates to help you get started quickly.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ArtworkMockupPage;
