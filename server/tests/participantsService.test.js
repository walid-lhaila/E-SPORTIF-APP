import ParticipantsService from '../services/participantsService';
import eventDb from '../models/eventModel';
jest.mock('../models/eventModel');  // Mock the eventDb model

describe('ParticipantsService', () => {
  let eventId;
  let participants;

  beforeEach(() => {
    eventId = 'event123';
    participants = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' }
    ];
  });

  describe('addParticipants', () => {
    it('should add participants to an event', async () => {
      // Mock the event retrieval and update operations
      const mockEvent = { participants: [] };
      const updateEventMock = jest.fn().mockResolvedValue({
        ...mockEvent,
        participants: [...mockEvent.participants, ...participants]
      });
      eventDb.findById.mockResolvedValue(mockEvent);
      eventDb.findByIdAndUpdate.mockImplementation(updateEventMock);

      const result = await ParticipantsService.addParticipants(eventId, participants);

      expect(eventDb.findById).toHaveBeenCalledWith(eventId);
      expect(eventDb.findByIdAndUpdate).toHaveBeenCalledWith(
        eventId,
        { $push: { participants: { $each: participants } } },
        { new: true }
      );
      expect(result.participants.length).toBe(2);
      expect(result.participants[0].name).toBe('John Doe');
      expect(result.participants[1].name).toBe('Jane Doe');
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findById.mockResolvedValue(null);

      await expect(ParticipantsService.addParticipants(eventId, participants))
        .rejects
        .toThrow('Event Not Found');
    });

    it('should throw an error if an error occurs during the operation', async () => {
      eventDb.findById.mockRejectedValue(new Error('Database error'));

      await expect(ParticipantsService.addParticipants(eventId, participants))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getAllParticipants', () => {
    it('should return all participants for the event', async () => {
      const mockEvent = {
        participants: [
          { name: 'John Doe', email: 'john@example.com' },
          { name: 'Jane Doe', email: 'jane@example.com' }
        ]
      };
      eventDb.findById.mockResolvedValue(mockEvent);

      const result = await ParticipantsService.getAllParticipants(eventId);

      expect(eventDb.findById).toHaveBeenCalledWith(eventId, 'participants');
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Doe');
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findById.mockResolvedValue(null);

      await expect(ParticipantsService.getAllParticipants(eventId))
        .rejects
        .toThrow('Event Not Found');
    });

    it('should throw an error if an error occurs during the operation', async () => {
      eventDb.findById.mockRejectedValue(new Error('Database error'));

      await expect(ParticipantsService.getAllParticipants(eventId))
        .rejects
        .toThrow('Database error');
    });
  });
});
