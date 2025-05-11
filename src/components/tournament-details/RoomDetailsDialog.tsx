import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RoomDetailsDialogProps } from "./types";

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  roomId,
  setRoomId,
  roomPassword,
  setRoomPassword,
  onSave,
  isSaving
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-[#1F2937] border-gaming-border text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Set Custom Room Details</DialogTitle>
          <DialogDescription className="text-gaming-muted">
            Enter the Room ID and Password for this tournament. This will be visible to joined participants.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomId" className="text-right text-gaming-muted">
              Room ID
            </Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="col-span-3 bg-[#111827] border-gaming-border focus:ring-gaming-primary text-white placeholder:text-gray-500"
              placeholder="Enter Room ID"
              style={{ color: 'white' }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomPassword" className="text-right text-gaming-muted">
              Password
            </Label>
            <Input
              id="roomPassword"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className="col-span-3 bg-[#111827] border-gaming-border focus:ring-gaming-primary text-white placeholder:text-gray-500"
              placeholder="Enter Room Password"
              style={{ color: 'white' }}
            />
          </div>
        </div>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="text-white border-gaming-muted hover:bg-gaming-muted/20">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={onSave}
            disabled={isSaving}
            style={{ backgroundColor: '#22C55E' }}
            className="text-white hover:opacity-90"
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsDialog; 