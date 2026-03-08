import { MessageCircle } from 'lucide-react';

export default function ZaloChatButton() {
  const handleClick = () => {
    window.open('https://zalo.me/', '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
      aria-label="Tư vấn qua Zalo"
    >
      <MessageCircle className="h-5 w-5" />
    </button>
  );
}
