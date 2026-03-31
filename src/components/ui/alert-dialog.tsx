import { Button } from './button';

export function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  return <Button variant="destructive" onClick={() => window.confirm('Yakin hapus project ini?') && onConfirm()}>Delete</Button>;
}
