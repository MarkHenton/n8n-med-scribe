import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Stethoscope, Brain, Heart, Activity, Microscope, BookOpen, Clock, Download, Play, FileText, Calendar, Book, icons, Pill, Dna, Bug, SquareActivity } from "lucide-react";
// import { Scalpel } from "lucide-react";
// "lucide-react" não exporta Scalpel. Use outro ícone, por exemplo, Scale:
import { Scale } from "lucide-react";

const disciplines = [
	{
		id: "Bases Científicas da Medicina (Medicina)",
		name: "Bases Científicas da Medicina (Medicina)",
		icon: Microscope,
		color: "medical-blue",
	},
	{
		id: "Integração dos Sistemas de Saúde (Medicina)",
		name: "Integração dos Sistemas de Saúde (Medicina)",
		icon: Activity,
		color: "medical-teal",
	},
	{
		id: "Microbiologia (Medicina)",
		name: "Microbiologia (Medicina)",
		icon: Dna,
		color: "medical-green",
	},
	{
		id: "Parasitologia (Medicina)",
		name: "Parasitologia (Medicina)",
		icon: Bug,
		color: "medical-amber",
	},
	{
		id: "Imunologia (Medicina)",
		name: "Imunologia (Medicina)",
		icon: Heart,
		color: "medical-pink",
	},
	{
		id: "Patologia Geral (Medicina)",
		name: "Patologia Geral (Medicina)",
		icon: Microscope,
		color: "medical-purple",
	},
	{
		id: "Farmacologia Geral (Medicina)",
		name: "Farmacologia Geral (Medicina)",
		icon: Pill,
		color: "medical-blue",
	},
	{
		id: "Atividades Integrativas e Ativas Eixo Iia (Medicina)",
		name: "Atividades Integrativas e Ativas Eixo Iia (Medicina)",
		icon: Heart,
		color: "medical-pink",
	},
	{
		id: "Introdução Às Técnicas Cirúrgicas (Medicina)",
		name: "Introdução Às Técnicas Cirúrgicas (Medicina)",
		icon: SquareActivity,
		color: "medical-green",
	},
	{
		id: "Atividades Práticas Interdisciplinares de Extensão II (Medicina)",
		name: "Atividades Práticas Interdisciplinares de Extensão II (Medicina)",
		icon: BookOpen,
		color: "medical-purple",
	},
];

const lectures = [];

export default function MedicalDashboard() {
	const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
	const [selectedLecture, setSelectedLecture] = useState<any>(null);

	// Filtra as aulas pela disciplina selecionada
	const filteredLectures = selectedDiscipline
		? lectures.filter((lecture) => lecture.discipline === selectedDiscipline)
		: [];

	return (
		<div className="min-h-screen bg-gradient-to-br from-medical-blue-light to-background">
			{/* Header */}
			<header className="border-b bg-card/50 backdrop-blur-sm">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="p-2 rounded-lg bg-gradient-to-br from-primary to-medical-teal">
								<Stethoscope className="h-6 w-6 text-white" />
							</div>
							<div>
								<h1 className="text-xl font-semibold text-foreground">
									MedScribe
								</h1>
								<p className="text-sm text-muted-foreground">
									Resumos Inteligentes de Medicina
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Badge
								variant="outline"
								className="bg-medical-blue-light border-medical-blue text-medical-blue-dark"
							>
								<Calendar className="h-3 w-3 mr-1" />
								Hoje: 3 aulas
							</Badge>
						</div>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-6 py-6">
				{!selectedDiscipline ? (
					// Página inicial: mostra as disciplinas
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{disciplines.map((discipline) => {
							const Icon = discipline.icon;
							// Conta aulas dessa disciplina
							const count = lectures.filter(
								(lecture) => lecture.discipline === discipline.id
							).length;
							return (
								<Card
									key={discipline.id}
									className="cursor-pointer hover:shadow-lg transition-all"
									onClick={() => setSelectedDiscipline(discipline.id)}
								>
									<CardHeader>
										<div className="flex items-center space-x-3">
											<Icon className="h-8 w-8 text-primary" />
											<CardTitle className="text-lg">
												{discipline.name}
											</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex w-full justify-center items-center h-12">
											<Badge
												variant="secondary"
												className="w-24 flex justify-center items-center text-center"
											>
												<span>{count}</span>
												<span className="ml-2">
													{count === 1 ? "aula" : "aulas"}
												</span>
											</Badge>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				) : (
					// Após selecionar disciplina, mostra as aulas recentes
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* Voltar para disciplinas */}
						<div className="lg:col-span-3 mb-4">
							<Button
								variant="ghost"
								onClick={() => {
									setSelectedDiscipline(null);
									setSelectedLecture(null);
								}}
							>
								← Voltar para Disciplinas
							</Button>
						</div>
						{/* Lista de Aulas */}
						<div className="lg:col-span-1">
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
											{filteredLectures.map((lecture) => (
												<Card
													key={lecture.id}
													className={`cursor-pointer transition-all hover:shadow-lg ${
														selectedLecture?.id === lecture.id
															? "ring-2 ring-primary bg-primary/5"
															: "hover:bg-secondary/50"
													}`}
													onClick={() => setSelectedLecture(lecture)}
												>
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
																<Badge
																	variant={
																		lecture.status === "transcrito"
																			? "default"
																			: "secondary"
																	}
																	className="text-xs"
																>
																	{lecture.status}
																</Badge>
																{lecture.hasAudio && (
																	<Badge variant="outline" className="text-xs">
																		<Play className="h-2 w-2 mr-1" />
																		Áudio
																	</Badge>
																)}
															</div>
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
						{/* Visualização da Aula */}
						<div className="lg:col-span-2">
							{selectedLecture ? (
								<Card className="shadow-elevated">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div>
												<CardTitle className="text-xl">
													{selectedLecture.title}
												</CardTitle>
												<CardDescription className="flex items-center mt-2">
													<Clock className="h-4 w-4 mr-1" />
													{selectedLecture.duration} •{" "}
													{selectedLecture.date}
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
												<TabsTrigger value="transcricao">
													Transcrição
												</TabsTrigger>
												<TabsTrigger value="audio">Áudio</TabsTrigger>
												<TabsTrigger value="slides">Slides</TabsTrigger>
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
																	{selectedLecture.summary?.topics?.length >
																	0 ? (
																		selectedLecture.summary.topics.map(
																			(topic, idx) => (
																				<li key={idx}>{topic}</li>
																			)
																		)
																	) : (
																		<li className="text-muted-foreground">
																			Nenhum tópico disponível.
																		</li>
																	)}
																</ul>

																<h3>Conceitos Importantes</h3>
																<p>
																	{selectedLecture.summary?.concepts
																		? selectedLecture.summary.concepts
																		: (
																			<span className="text-muted-foreground">
																				Nenhum conceito disponível.
																			</span>
																		)}
																</p>

																<h3>Pontos para Revisão</h3>
																<ul>
																	{selectedLecture.summary?.reviewPoints?.length >
																	0 ? (
																		selectedLecture.summary.reviewPoints.map(
																			(point, idx) => (
																				<li key={idx}>{point}</li>
																			)
																		)
																	) : (
																		<li className="text-muted-foreground">
																			Nenhum ponto para revisão disponível.
																		</li>
																	)}
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
																	<span className="text-muted-foreground">
																		[00:00]
																	</span>{" "}
																	Boa tarde, turma. Hoje vamos estudar o sistema
																	cardíaco, começando pela anatomia do coração...
																</p>
																<p className="mb-4">
																	<span className="text-muted-foreground">
																		[00:45]
																	</span>{" "}
																	O coração é um órgão muscular oco, localizado no
																	mediastino, entre os pulmões. Possui quatro
																	câmaras: dois átrios e dois ventrículos...
																</p>
																<p className="mb-4">
																	<span className="text-muted-foreground">
																		[02:15]
																	</span>{" "}
																	As válvulas cardíacas são estruturas fundamentais
																	que garantem o fluxo unidirecional do sangue...
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
																<p className="text-muted-foreground">
																	Player de áudio seria implementado aqui
																</p>
																<p className="text-sm text-muted-foreground mt-2">
																	Duração: {selectedLecture.duration}
																</p>
															</div>
														</div>
													</CardContent>
												</Card>
											</TabsContent>
											<TabsContent value="slides" className="mt-4">
												<Card>
													<CardHeader>
														<CardTitle>Slides da Aula</CardTitle>
													</CardHeader>
													<CardContent>
														<div className="flex items-center justify-center h-[400px] bg-secondary/20 rounded-lg">
															<div className="text-center text-muted-foreground">
																Slides da aula seriam exibidos aqui.
															</div>
														</div>
													</CardContent>
												</Card>
											</TabsContent>
										</Tabs>
									</CardContent>
								</Card>
							) : (
								<div className="flex items-center justify-center h-full">
									<span className="text-lg text-muted-foreground">
										Selecione uma aula para ver os detalhes.
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}