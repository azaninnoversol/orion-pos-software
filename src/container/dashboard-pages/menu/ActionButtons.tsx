import CustomTooltip from "@/components/CustomTooltip";
import DeleteModal from "@/components/DeleteModal";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";

export interface ActionButtonProps {
  row?: any;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  title?: string;
  desc?: string;
  confirmText?: string;
  cancelText?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  row,
  onEdit,
  onDelete,
  title = "",
  desc = "",
  confirmText = "",
  cancelText = "",
}) => {
  const openModalHandler = () => setOpenModal?.(row?.original?.id);
  const deleteItemHandler = () => onDelete?.(row?.original);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex items-center justify-end gap-3 pr-3">
      <CustomTooltip title="Edit">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full !bg-[#3238a1]"
          onClick={() => onEdit?.(row?.original)}
        >
          <SquarePen className="text-white" />
        </Button>
      </CustomTooltip>

      <CustomTooltip title="Delete">
        <Button
          variant="ghost"
          size="icon"
          className="!bg-red-500 rounded-full"
          onClick={openModalHandler}
        >
          <Trash2 className="text-white" />
        </Button>
      </CustomTooltip>

      <DeleteModal
        open={openModal === row?.original?.id}
        setOpen={setOpenModal}
        title={title || "Confirm Delete Item!"}
        description={desc || "Are you sure you want to delete this item?"}
        confirmText={confirmText || "Delete Item"}
        cancelText={cancelText || "No! Delete"}
        onConfirm={deleteItemHandler}
        icon={Trash2}
      />
    </div>
  );
};

export { ActionButton };
