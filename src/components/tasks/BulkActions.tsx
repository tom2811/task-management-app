import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBulkDeleteTasks } from "@/hooks/useBulkDeleteTasks";
import { useState } from "react";
import { useTaskStore } from "../../store/taskStore";

export const BulkActions = () => {
  const selectedTaskIds = useTaskStore((state) => state.selectedTaskIds);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { mutate: bulkDeleteMutation, isPending } = useBulkDeleteTasks();

  const handleBulkDelete = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    bulkDeleteMutation(selectedTaskIds);
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="destructive"
          onClick={handleBulkDelete}
          disabled={selectedTaskIds.length === 0 || isPending}
        >
          {isPending
            ? "Deleting..."
            : `Delete Selected (${selectedTaskIds.length})`}
        </Button>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedTaskIds.length} selected
              tasks? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
