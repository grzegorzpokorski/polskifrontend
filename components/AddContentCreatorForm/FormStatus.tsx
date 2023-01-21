'use client';

import Image from 'next/image';
import { memo } from 'react';

import type { Status } from '../../hooks/useMutation';

type FormStatusProps = {
  readonly status: Status;
  readonly errorCode?: number;
};

const errorToMessage: Record<number, string> = {
  409: 'Blog o podanym adresie został już dodany do naszej bazy danych. Jeżeli nie pojawiają się najnowsze wpisy lub masz inne zastrzeżenia – proszę skontaktuj się z administratorem.',
  400: `Nie udało się wyciągnąć ID kanału z podanego adresu YouTube. Postaraj się znaleźć adres w postaci https://youtube.com/channel/{ID_KANAŁU} lub https://youtube.com/user/{ID_UŻYTKOWNIKA}`,
  422: 'Nie udało się odnaleźć pliku RSS na twojej stronie. Upewnij się, że strona posiada RSS/ATOM i link do niego jest poprawnie dodany w sekcji <head> na stronie.',
};

const defaultErrorMessage =
  'Wystąpił błąd podczas dodawania nowego serwisu. Sprawdź poprawność danych i spróbuj ponownie.';

function getStatusMessage({ status, errorCode }: FormStatusProps) {
  switch (status) {
    case 'loading':
      return 'Oczekiwanie...';
    case 'success':
      return 'Dziękujemy za zgłoszenie, dodany serwis pojawi się na stronie po zaakceptowaniu przez administrację';
    case 'error':
      return errorCode ? errorToMessage[errorCode] ?? defaultErrorMessage : defaultErrorMessage;
    default:
      return null;
  }
}

function getStatusIcon(status: Status) {
  switch (status) {
    case 'loading':
      return 'spinner3';
    case 'success':
      return 'checkmark';
    case 'error':
      return 'cross';
    default:
      return 'question';
  }
}

export const FormStatus = memo<FormStatusProps>(({ status, errorCode }) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="mt-7 flex justify-center gap-2 rounded-sm p-2 text-center text-lg" role="status">
      <Image src={`/icons/${getStatusIcon(status)}.svg`} width="16" height="16" alt="" />
      <span>{getStatusMessage({ status, errorCode })}</span>
    </div>
  );
});
FormStatus.displayName = 'FormStatus';
