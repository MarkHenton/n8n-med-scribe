import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Stethoscope, Brain, Heart, Activity, Microscope, BookOpen, Clock, Download, Play, FileText, Calendar } from "lucide-react";
const disciplines = [{
  id: "anatomia",
  name: "Anatomia",
  icon: Microscope,
  color: "medical-blue",
  count: 12
}, {
  id: "fisiologia",
  name: "Fisiologia",
  icon: Activity,
  color: "medical-teal",
  count: 8
}, {
  id: "patologia",
  name: "Patologia",
  icon: Brain,
  color: "medical-green",
  count: 15
}, {
  id: "cardiologia",
  name: "Cardiologia",
  icon: Heart,
  color: "medical-blue-dark",
  count: 6
}, {
  id: "clinica",
  name: "Clínica Médica",
  icon: Stethoscope,
  color: "medical-amber",
  count: 20
}];
const lectures = [{
  id: 1,
  title: "Sistema Cardiovascular - Anatomia do Coração",
  discipline: "anatomia",
  duration: "45 min",
  date: "2024-01-15",
  status: "transcrito",
  hasAudio: true,
  hasTranscript: true,
  hasSummary: true
}, {
  id: 2,
  title: "Fisiologia da Contração Cardíaca",
  discipline: "fisiologia",
  duration: "38 min",
  date: "2024-01-14",
  status: "processando",
  hasAudio: true,
  hasTranscript: false,
  hasSummary: false
}, {
  id: 3,
  title: "Arritmias Cardíacas - Diagnóstico e Tratamento",
  discipline: "cardiologia",
  duration: "52 min",
  date: "2024-01-13",
  status: "transcrito",
  hasAudio: true,
  hasTranscript: true,
  hasSummary: true
}];
export default function MedicalDashboard() {
  const [selectedDiscipline, setSelectedDiscipline] = useState("todos");
  const [selectedLecture, setSelectedLecture] = useState(lectures[0]);
  const filteredLectures = selectedDiscipline === "todos" ? lectures : lectures.filter(lecture => lecture.discipline === selectedDiscipline);
  return <div className="min-h-screen bg-gradient-to-br from-medical-blue-light to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-medical-teal">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">MedScribe</h1>
                <p className="text-sm text-muted-foreground">Resumos Inteligentes de Medicina</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-medical-blue-light border-medical-blue text-medical-blue-dark">
                <Calendar className="h-3 w-3 mr-1" />
                Hoje: 3 aulas
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Disciplinas */}
          <div className="lg:col-span-1">
            <Card className="shadow-medical">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Disciplinas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant={selectedDiscipline === "todos" ? "default" : "ghost"} className="w-full justify-start" onClick={() => setSelectedDiscipline("todos")}>
                  Todas as disciplinas
                </Button>
                
                <Separator className="my-2" />
                
                {disciplines.map(discipline => {
                const Icon = discipline.icon;
                return <Button key={discipline.id} variant={selectedDiscipline === discipline.id ? "default" : "ghost"} className="w-full justify-between" onClick={() => setSelectedDiscipline(discipline.id)}>
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {discipline.name}
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {discipline.count}
                      </Badge>
                    </Button>;
              })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Lista de Aulas */}
              <div className="xl:col-span-1">
                <Card className="shadow-medical">
                  <CardHeader>
                    <CardTitle className="text-lg">Aulas Recentes</CardTitle>
                    <CardDescription>
                      {filteredLectures.length} aula(s) encontrada(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-3">
                        {filteredLectures.map(lecture => <Card key={lecture.id} className={`cursor-pointer transition-all hover:shadow-lg ${selectedLecture.id === lecture.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/50'}`} onClick={() => setSelectedLecture(lecture)}>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <h3 className="font-medium text-sm line-clamp-2">
                                  {lecture.title}
                                </h3>
                                
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lecture.duration}
                                  </div>
                                  <span>{lecture.date}</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                  <Badge variant={lecture.status === 'transcrito' ? 'default' : 'secondary'} className="text-xs">
                                    {lecture.status}
                                  </Badge>
                                  {lecture.hasAudio && <Badge variant="outline" className="text-xs">
                                      <Play className="h-2 w-2 mr-1" />
                                      Áudio
                                    </Badge>}
                                </div>
                              </div>
                            </CardContent>
                          </Card>)}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Visualização da Aula */}
              <div className="xl:col-span-2">
                <Card className="shadow-elevated">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{selectedLecture.title}</CardTitle>
                        <CardDescription className="flex items-center mt-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {selectedLecture.duration} • {selectedLecture.date}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="resumo" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="resumo">Resumo</TabsTrigger>
                        <TabsTrigger value="transcricao">Transcrição</TabsTrigger>
                        <TabsTrigger value="audio">Áudio</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="resumo" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center text-lg">
                              <FileText className="h-5 w-5 mr-2" />
                              Resumo Inteligente
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[400px]">
                              <div className="prose prose-sm max-w-none">
                                <h3>Principais Tópicos</h3>
                                <ul>
                                  <li><strong>Anatomia do coração:</strong> Estruturas principais, câmaras cardíacas e válvulas</li>
                                  <li><strong>Circulação sistêmica:</strong> Fluxo sanguíneo e pressão arterial</li>
                                  <li><strong>Ciclo cardíaco:</strong> Sístole e diástole, regulação neural</li>
                                </ul>
                                
                                <h3>Conceitos Importantes</h3>
                                <p>O sistema cardiovascular é responsável pelo transporte de oxigênio e nutrientes para todas as células do corpo. A compreensão da anatomia cardíaca é fundamental para...</p>
                                
                                <h3>Pontos para Revisão</h3>
                                <ul>
                                  <li>Revisar as 4 câmaras do coração e suas funções</li>
                                  <li>Estudar os tipos de válvulas cardíacas</li>
                                  <li>Compreender a diferença entre circulação pulmonar e sistêmica</li>
                                </ul>
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="transcricao" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Transcrição Completa</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[400px]">
                              <div className="text-sm leading-relaxed">
                                <p className="mb-4">
                                  <span className="text-muted-foreground">[00:00]</span> Boa tarde, turma. Hoje vamos estudar o sistema cardiovascular, começando pela anatomia do coração...
                                </p>
                                <p className="mb-4">
                                  <span className="text-muted-foreground">[00:45]</span> O coração é um órgão muscular oco, localizado no mediastino, entre os pulmões. Possui quatro câmaras: dois átrios e dois ventrículos...
                                </p>
                                <p className="mb-4">
                                  <span className="text-muted-foreground">[02:15]</span> As válvulas cardíacas são estruturas fundamentais que garantem o fluxo unidirecional do sangue...
                                </p>
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="audio" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Reprodução de Áudio</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-center h-[400px] bg-secondary/20 rounded-lg">
                              <div className="text-center">
                                <div className="p-4 rounded-full bg-primary/10 mb-4 mx-auto w-fit">
                                  <Play className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-muted-foreground">Player de áudio seria implementado aqui</p>
                                <p className="text-sm text-muted-foreground mt-2">Duração: {selectedLecture.duration}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}