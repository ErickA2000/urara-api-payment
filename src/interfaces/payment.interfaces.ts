
export interface PayMercadopago {
    payservice:           string;
    cliente:              string;
    vendedor:             string;
    products:             Product[];
    productos:            Producto[];
    direccionFacturacion: DireccionFacturacion;
    subtotal:             number;
    descuento:            number;
    iva:                  string;
    iva_moneda:           number;
    total:                number;
}

export interface DireccionFacturacion {
    pais:                   string;
    departamento:           string;
    ciudad:                 string;
    direccion:              string;
    especificacionOpcional?: string;
}

export interface Producto {
    productID:            string;
    tallasCantidadPrecio: TallasCantidadPrecio;
}

export interface TallasCantidadPrecio {
    talla:    string;
    cantidad: number;
    color:    string;
    precio:   number;
}

export interface Product {
    title:       string;
    unit_price:  number;
    currency_id: Currency;
    quantity:    number;
}

enum Currency{
    Cop = "COP"
}

export interface IResponseMercadoPago {
    accounts_info:               null;
    acquirer_reconciliation:     any[];
    additional_info:             AdditionalInfo;
    authorization_code:          null;
    binary_mode:                 boolean;
    brand_id:                    null;
    build_version:               string;
    call_for_authorize_id:       null;
    captured:                    boolean;
    card:                        Card;
    charges_details:             any[];
    collector_id:                number;
    corporation_id:              null;
    counter_currency:            null;
    coupon_amount:               number;
    currency_id:                 string;
    date_approved:               Date;
    date_created:                Date;
    date_last_updated:           Date;
    date_of_expiration:          Date;
    deduction_schema:            null;
    description:                 string;
    differential_pricing_id:     null;
    external_reference:          null;
    fee_details:                 Array<null[]>;
    financing_group:             null;
    id:                          number;
    installments:                number;
    integrator_id:               null;
    issuer_id:                   string;
    live_mode:                   boolean;
    marketplace_owner:           null;
    merchant_account_id:         null;
    merchant_number:             null;
    metadata:                    Card;
    money_release_date:          Date;
    money_release_schema:        null;
    money_release_status:        null;
    net_amount:                  null;
    notification_url:            string;
    operation_type:              string;
    order:                       Order;
    payer:                       Payer;
    payment_method:              PaymentMethod;
    payment_method_id:           string;
    payment_type_id:             string;
    platform_id:                 null;
    point_of_interaction:        PointOfInteraction;
    pos_id:                      null;
    processing_mode:             string;
    refunds:                     any[];
    shipping_amount:             number;
    sponsor_id:                  null;
    statement_descriptor:        null;
    status:                      string;
    status_detail:               string;
    store_id:                    null;
    tags:                        null;
    taxes:                       Array<null[]>;
    taxes_amount:                number;
    transaction_amount:          number;
    transaction_amount_refunded: number;
    transaction_details:         TransactionDetails;
}

export interface AdditionalInfo {
    authentication_code: null;
    available_balance:   null;
    ip_address:          string;
    items:               null[];
    nsu_processadora:    null;
}

export interface Card {
}

export interface Order {
    id:   string;
    type: string;
}

export interface Payer {
    first_name:     null;
    last_name:      null;
    email:          string;
    identification: null[];
    phone:          null[];
    type:           null;
    entity_type:    null;
    id:             string;
}

export interface PaymentMethod {
    id:        string;
    issuer_id: string;
    type:      string;
}

export interface PointOfInteraction {
    business_info:    null[];
    transaction_data: null[];
    type:             string;
}

export interface TransactionDetails {
    acquirer_reference:          null;
    external_resource_url:       null;
    financial_institution:       null;
    installment_amount:          number;
    net_received_amount:         number;
    overpaid_amount:             number;
    payable_deferral_period:     null;
    payment_method_reference_id: null;
    total_paid_amount:           number;
}
