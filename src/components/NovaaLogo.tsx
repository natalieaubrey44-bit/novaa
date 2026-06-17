import { imageSources } from '../data/imageSources';
interface NovaaLogoProps {
  className?: string;
  iconSize?: number;
}

export default function NovaaLogo({ className = "", iconSize = 32 }: { className?: string, iconSize?: number }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={imageSources.logo}
        alt="Novaa"
        style={{ width: iconSize, height: iconSize, objectFit: 'contain' }}
      />
    </div>
  );
}
