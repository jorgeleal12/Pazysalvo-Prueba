import React,{useState} from 'react';
import {  
  WordIcon,
  ExcelIcon,
  PowerPointIcon,
  FilesPdfColoredIcon,
  FilesPictureColoredIcon
} from "@fluentui/react-icons-northstar";
interface DownloadButtonProps {
  base64Data: string;
  fileName: string;
  filExte: string;
  onClick: () => void;
}
const DownloadButton: React.FC<DownloadButtonProps> = ({ base64Data, fileName, filExte,onClick }) => {

const [filexte, setfilexte] = useState('');

setfilexte(filExte);
  const handleDownload = () => {
    const linkSource = base64Data;
    const downloadLink = document.createElement("a");
    const fileNamed = fileName;

    downloadLink.href = linkSource;
    downloadLink.download = fileNamed;
    downloadLink.click();
    onClick () ;
  };

  return (<>
    {filexte !=='' ? filexte==='docx'|| filexte==='doc' ? <WordIcon id='1' size="larger" onClick={handleDownload}/>:filexte==='xls'|| filexte==='xlsx' ? <ExcelIcon />:filexte==='ppt'|| filexte==='pptx' ?<PowerPointIcon />:filexte==='pdf' ?<FilesPdfColoredIcon />:filexte==='jpg'|| filexte==='jpeg'||filexte==='png'||filexte==='gif'?<FilesPictureColoredIcon />:'':''}
    </>
    );
};

export default DownloadButton;