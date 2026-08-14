import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  meta?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
}

export function Modal({ title, meta, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal__head">
          <h2 className="modal__title">{title}</h2>
          {meta ? <p className="modal__meta">{meta}</p> : null}
        </header>
        <div className="modal__body">{children}</div>
        <footer className="modal__foot">{footer}</footer>
      </div>
    </div>
  );
}
