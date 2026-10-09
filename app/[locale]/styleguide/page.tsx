import type { Metadata } from 'next';
import { StyleguideView } from './StyleguideView';

export const metadata: Metadata = {
  title: 'Styleguide',
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return <StyleguideView />;
}
