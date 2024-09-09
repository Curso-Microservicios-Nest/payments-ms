export interface PayPalOrder {
  id: string;
  status: string;
  payment_source: {
    paypal: {
      email_address: string;
      account_id: string;
      account_status: string;
      name: {
        given_name: string;
        surname: string;
      };
      address: {
        country_code: string;
      };
    };
  };
  purchase_units: PurchaseUnit[];
  payer: {
    name: {
      given_name: string;
      surname: string;
    };
    email_address: string;
    payer_id: string;
    address: {
      country_code: string;
    };
  };
  links: Link[];
}

export interface PurchaseUnit {
  reference_id: string;
  payments: {
    captures: Capture[];
  };
}

export interface Capture {
  id: string;
  status: string;
  amount: {
    currency_code: string;
    value: string;
  };
  final_capture: boolean;
  seller_protection: {
    status: string;
    dispute_categories: string[];
  };
  seller_receivable_breakdown: {
    gross_amount: {
      currency_code: string;
      value: string;
    };
    paypal_fee: {
      currency_code: string;
      value: string;
    };
    net_amount: {
      currency_code: string;
      value: string;
    };
  };
  custom_id: string;
  links: Link[];
  create_time: string;
  update_time: string;
}

export interface Link {
  href: string;
  rel: string;
  method: string;
}
