import EventService from '../services/eventService';
import eventDb from '../models/eventModel';
import minio from '../../minio';

jest.mock('../models/eventModel');
jest.mock('../../minio');

describe('EventService', () => {
  let eventData;
  let userId;
  let file;

  beforeEach(() => {
    eventData = {
      title: 'Test Event',
      description: 'Test Event Description',
      date: '2024-12-01',
      category: 'Sports'
    };
    userId = 'user123';
    file = {
      originalname: 'event-image.jpg',
      path: '/tmp/event-image.jpg'
    };
  });

  describe('createEvent', () => {
    it('should create an event with an image', async () => {
      // Mock methods
      minio.fPutObject.mockResolvedValue(true);
      minio.bucketExists.mockResolvedValue(true);

      const saveMock = jest.fn().mockResolvedValue({
        ...eventData,
        image: 'http://127.0.0.1:9000/e-sportif/images/event-image.jpg',
        organizer: userId
      });
      eventDb.mockImplementation(() => ({
        save: saveMock
      }));

      const result = await EventService.createEvent(eventData, userId, { image: file });

      expect(minio.fPutObject).toHaveBeenCalledWith('e-sportif', 'images/event-image.jpg', file.path);
      expect(saveMock).toHaveBeenCalled();
      expect(result.title).toBe(eventData.title);
      expect(result.image).toBe('http://127.0.0.1:9000/e-sportif/images/event-image.jpg');
    });

    it('should throw an error if the image file is not provided', async () => {
      await expect(EventService.createEvent(eventData, userId, {}))
        .rejects
        .toThrow('File Is Required');
    });
  });

  describe('getEventByUserId', () => {
    it('should return events for a specific user', async () => {
      const mockEvents = [
        { title: 'Test Event 1', organizer: userId },
        { title: 'Test Event 2', organizer: userId }
      ];
      eventDb.find.mockResolvedValue(mockEvents);

      const result = await EventService.getEventByUserId(userId);

      expect(eventDb.find).toHaveBeenCalledWith({ organizer: userId });
      expect(result.length).toBe(2);
      expect(result[0].title).toBe('Test Event 1');
    });
  });

  describe('deleteEvent', () => {
    it('should delete the event if it belongs to the user', async () => {
      const mockEvent = { _id: 'event123' };
      eventDb.findOneAndDelete.mockResolvedValue(mockEvent);

      const result = await EventService.deleteEvent('event123', userId);

      expect(eventDb.findOneAndDelete).toHaveBeenCalledWith({ _id: 'event123', organizer: userId });
      expect(result).toBe('event123');
    });

    it('should throw an error if the event is not found or unauthorized', async () => {
      eventDb.findOneAndDelete.mockResolvedValue(null);

      await expect(EventService.deleteEvent('event123', userId))
        .rejects
        .toThrow('Event Not Found Or Unauthorized');
    });
  });

  describe('updateEvent', () => {
    it('should update the event and return the updated data', async () => {
      const mockEvent = { _id: 'event123', title: 'Original Title' };
      const updatedData = { title: 'Updated Event' };

      eventDb.findByIdAndUpdate.mockResolvedValue({ ...mockEvent, ...updatedData });

      const updatedEvent = await EventService.updateEvent('event123', updatedData, file);

      expect(eventDb.findByIdAndUpdate).toHaveBeenCalledWith(
        'event123',
        { $set: updatedData },
        { new: true }
      );
      expect(updatedEvent.title).toBe('Updated Event');
    });

    it('should include an updated image if a new file is provided', async () => {
      const mockEvent = { _id: 'event123', title: 'Original Title' };
      const updatedData = { title: 'Updated Event' };

      minio.bucketExists.mockResolvedValue(true);
      minio.fPutObject.mockResolvedValue(true);

      const newImageUrl = 'http://127.0.0.1:9000/e-sportif/images/newEvent-image.jpg';
      jest.spyOn(EventService, 'uploadEventImage').mockResolvedValue(newImageUrl);

      eventDb.findByIdAndUpdate.mockResolvedValue({ ...mockEvent, ...updatedData, image: newImageUrl });

      const updatedEvent = await EventService.updateEvent('event123', updatedData, file);

      expect(EventService.uploadEventImage).toHaveBeenCalledWith(file, 'images');
      expect(eventDb.findByIdAndUpdate).toHaveBeenCalledWith(
        'event123',
        { $set: { ...updatedData, image: newImageUrl } },
        { new: true }
      );
      expect(updatedEvent.image).toBe(newImageUrl);
    });

    it('should throw an error if the event is not found', async () => {
      eventDb.findByIdAndUpdate.mockResolvedValue(null);

      await expect(EventService.updateEvent('event123', { title: 'Updated Event' }))
        .rejects
        .toThrow('Event Not Found');
    });
  });


  });

