import { Bell, Plus } from "lucide-react";
import { Button } from "../Button/Button";
import Input from "../Input/Input";

const AppHeader = () => {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-4">
      <Input placeholder="Search Students..." />
      <div className="flex items-center gap-4">
        <Button variant="primary">
          <Plus size={16} />
          Schedule a session
        </Button>
        <Bell size={20} />
      </div>
    </header>
  );
};

export default AppHeader;
