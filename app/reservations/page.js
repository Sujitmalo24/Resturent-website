import ReservationForm from '../../components/ReservationForm';

export const metadata = {
  title: 'Make a Reservation | Restaurant Name',
  description: 'Book your table at our restaurant. Experience exceptional dining with fresh ingredients and outstanding service.',
  keywords: 'restaurant reservation, book table, fine dining, restaurant booking'
};

export default function ReservationsPage() {
  return (
    <main>
      <ReservationForm />
    </main>
  );
}
