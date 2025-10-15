// ========== PART 2: FRONTEND - NotificationCenter.test.tsx ==========
// File Path: frontend/src/features/notifications/__tests__/NotificationCenter.test.tsx

// --- Mocks for Frontend Test ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    disconnect: jest.fn(),
  })),
}));

describe('Frontend: NotificationCenter Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display initial notifications', async () => {
    const mockNotifications = [
      { _id: '1', title: 'First Notification', message: 'Hello', read: false },
      { _id: '2', title: 'Second Notification', message: 'World', read: true },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });

    render(<NotificationCenter />);

    expect(await screen.findByText('First Notification')).toBeInTheDocument();
    expect(screen.getByText('Second Notification')).toBeInTheDocument();
    
    // Check that the read notification has the correct styling/state
    const readNotification = screen.getByText('Second Notification').closest('li');
    expect(readNotification).toHaveClass('opacity-60');
  });

  it('should call the API to mark a notification as read when clicked', async () => {
    const mockNotifications = [{ _id: '1', title: 'Unread', message: '...', read: false }];
    mockedAxios.get.mockResolvedValue({ data: mockNotifications });
    mockedAxios.patch.mockResolvedValue({});
    
    render(<NotificationCenter />);

    const markAsReadButton = await screen.findByRole('button', { name: /Mark as Read/i });
    fireEvent.click(markAsReadButton);

    // Assert optimistic UI update
    expect(markAsReadButton).not.toBeInTheDocument();

    // Assert API call
    await waitFor(() => {
      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/notifications/1/read', {}, expect.any(Object));
    });
  });
});