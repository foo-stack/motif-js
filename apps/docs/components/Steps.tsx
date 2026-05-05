import type { ReactNode } from 'react';

export interface StepsProps {
  children: ReactNode;
}

export function Steps({ children }: StepsProps) {
  return <ol className="steps">{children}</ol>;
}

export interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

export function Step({ title, children }: StepProps) {
  return (
    <li className="steps__item">
      <h3 className="steps__title">{title}</h3>
      <div className="steps__body">{children}</div>
    </li>
  );
}
