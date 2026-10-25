import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import ApiDocMixin "mixins/api-doc";

actor {
  // Shared authorization state. QRNova has no accounts and no user records;
  // this surface is preserved so future optional features can gate access.
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  // OQL exposure. No app entities are registered because the backend stores
  // no structured data — QR codes are generated in the browser.
  include Expose({ entities = [] });

  // Static behavioral API documentation.
  include ApiDocMixin();
};
