import { Model } from "@/models/Model";
import { Api } from "@/models/Api";

export class Booking extends Model {
  constructor(data = {}) {
    super(Api.END_POINTS.SYNTHETIC(), data);
  }

  grills(options = {}) {
    return this.get(Api.END_POINTS.GRILLS(), options);
  }

  schedules(id, options = {}) {
    return this.get(Api.END_POINTS.BOOK_SCHEDULES(id), options);
  }

  autocomplete(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PAYMENTS_COMPLETE(), options);
  }

  parks(options = {}) {
    return this.get(Api.END_POINTS.PSE_PARKS(), options);
  }

  services(pseParkId, options = {}) {
    return this.post(Api.END_POINTS.PSE_SERVICES(pseParkId), options);
  }

  banks(options = {}) {
    return this.get(Api.END_POINTS.PSE_BANKS(), options);
  }

  payment(id, options = {}) {
    return this.post(Api.END_POINTS.BOOK_PAYMENT(id), options);
  }

  transfer(options = {}) {
    return this.post(Api.END_POINTS.PSE_TRANSFER_BANKS(), options);
  }

  reference(scheduleId, reference, options = {}) {
    return this.put(
      Api.END_POINTS.PORTAL_PAYMENTS_UPDATE(scheduleId, reference),
      options
    );
  }

  status(status, options = {}) {
    return this.get(Api.END_POINTS.PSE_TRANSFER_STATUS(status), options);
  }

  bookings(options = {}) {
    return this.get(Api.END_POINTS.LATEST_BOOKINGS(), options);
  }

  paymentStatus(payment, options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PAYMENTS_STATUS(payment), options);
  }

  pendingToPay(options = {}) {
    return this.get(Api.END_POINTS.PORTAL_PENDING_TO_PAY(), options);
  }

  /**
   * Create a new instance from model
   *
   * @param data
   * @returns {Booking}
   */
  clone(data) {
    return new Booking(data);
  }
}
