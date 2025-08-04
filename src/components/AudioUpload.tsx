import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileAudio, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadProps {
  disciplineId: string;
  disciplineName: string;
  onUploadComplete?: (result: any) => void;
}

interface WhisperXResponse {
  task_id?: string;
  taskId?: string;
  status?: string;
  message?: string;
}

export default function AudioUpload({ disciplineId, disciplineName, onUploadComplete }: AudioUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'transcribing' | 'completed' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é um arquivo de áudio
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um arquivo de áudio válido.",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar tamanho (limite de 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Limite máximo: 100MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadToVPS = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('discipline_id', disciplineId);
      formData.append('discipline_name', disciplineName);
      formData.append('filename', selectedFile.name);

      // Progresso real de upload usando XMLHttpRequest
      const xhr = new XMLHttpRequest();
      
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText);
              resolve(result);
            } catch (e) {
              reject(new Error('Resposta inválida do servidor'));
            }
          } else {
            reject(new Error(`Erro HTTP: ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Erro de rede durante o upload'));
        });

        // Substitua pela URL da sua VPS WhisperX
        const VPS_WHISPERX_URL = 'https://sua-vps.com/api/whisperx/transcribe';
        
        xhr.open('POST', VPS_WHISPERX_URL);
        xhr.send(formData);
      });

      const result = await uploadPromise as WhisperXResponse;
      
      setStatus('transcribing');
      setTranscriptionProgress(0);
      
      // Começar polling para progresso da transcrição
      const taskId = result.task_id || result.taskId;
      if (taskId) {
        pollTranscriptionProgress(taskId);
      } else {
        throw new Error('ID da tarefa não retornado pela API');
      }

    } catch (error) {
      console.error('Erro no upload:', error);
      setStatus('error');
      toast({
        title: "Erro no Upload",
        description: error.message || "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const pollTranscriptionProgress = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Substituir pela URL da sua VPS WhisperX
        const response = await fetch(`https://sua-vps.com/api/whisperx/status/${taskId}`);
        const data = await response.json();

        setTranscriptionProgress(data.progress || 0);

        if (data.status === 'completed') {
          clearInterval(pollInterval);
          setStatus('completed');
          toast({
            title: "Transcrição Concluída!",
            description: "A aula foi transcrita e o resumo foi gerado com sucesso.",
          });
          
          onUploadComplete?.(data);
          
          // Reset após 3 segundos
          setTimeout(() => {
            setStatus('idle');
            setSelectedFile(null);
            setUploadProgress(0);
            setTranscriptionProgress(0);
          }, 3000);
        } else if (data.status === 'error') {
          clearInterval(pollInterval);
          setStatus('error');
          toast({
            title: "Erro na Transcrição",
            description: "Houve um problema ao processar o áudio.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    }, 2000);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'transcribing':
        return <FileAudio className="h-4 w-4 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Enviando áudio...';
      case 'transcribing':
        return 'Transcrevendo com WhisperX...';
      case 'completed':
        return 'Concluído!';
      case 'error':
        return 'Erro no processamento';
      default:
        return 'Pronto para upload';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <FileAudio className="h-5 w-5" />
          <span>Upload de Áudio</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seleção de arquivo */}
        <div className="space-y-2">
          <label htmlFor="audio-upload" className="block text-sm font-medium">
            Selecionar arquivo de áudio da aula
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={status !== 'idle'}
            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {selectedFile && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <FileAudio className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <span>({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
            </div>
          )}
        </div>

        {/* Status e progresso */}
        {status !== 'idle' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="flex items-center space-x-1">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </Badge>
              {status === 'transcribing' && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Processando...</span>
                </div>
              )}
            </div>

            {status === 'uploading' && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Upload</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            {status === 'transcribing' && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Transcrição</span>
                  <span>{transcriptionProgress}%</span>
                </div>
                <Progress value={transcriptionProgress} />
              </div>
            )}
          </div>
        )}

        {/* Botão de upload */}
        <Button
          onClick={uploadToVPS}
          disabled={!selectedFile || status !== 'idle'}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Processando...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Enviar e Transcrever
            </>
          )}
        </Button>

        {/* Informações adicionais */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Formatos aceitos: MP3, WAV, M4A, OGG</p>
          <p>• Tamanho máximo: 100MB</p>
          <p>• A transcrição será feita automaticamente com WhisperX</p>
        </div>
      </CardContent>
    </Card>
  );
}