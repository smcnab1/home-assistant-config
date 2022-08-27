const _ = require('underscore');
const assert = require('chai').assert;
const fs = require('fs');
const os = require('os');

const RED = require('../lib/red-stub')();
const ContextProviders = require('../chat-context-factory');

describe('Chat context provider memory', () => {
  const contextProviders = ContextProviders(RED);
  const path = os.tmpdir();
  const getProvider = () => contextProviders.getProvider('memory', {
    chatbotId: 'my-bot'
  });

  beforeAll(async () => {
    const provider = getProvider();
    await provider.start();
  });

  afterAll(async () => {
  });

  it('should create a context provider with some default params with userId', async () => {

    assert.isTrue(contextProviders.hasProvider('memory'));
    const provider = getProvider();
    assert.isFunction(provider.getOrCreate);
    assert.isFunction(provider.get);
    const chatContext = await provider.getOrCreateContext(43, { chatId: 43 });
    await chatContext.set({ myVariable: 'initial value' })
    assert.isFunction(chatContext.get);
    assert.isFunction(chatContext.set);
    assert.isFunction(chatContext.all);
    assert.isFunction(chatContext.remove);
    assert.isFunction(chatContext.clear);
    const myVariable = await  chatContext.get('myVariable');

    assert.equal(myVariable, 'initial value');
  });

  it('should create a userId given the chatId and transport', async () => {
    const provider = getProvider();

    const userId = await provider.getOrCreateUserId('42', 'telegram');
    assert.equal(userId, '42');
    const context42 = await provider.getOrCreateContext('42', { });
    await context42.set('myVar', 'guido');
    await context42.set('anotherVar', 'guidone');
    assert.equal(await context42.get('myVar'), 'guido');
    assert.equal(await context42.get('anotherVar'), 'guidone');

    const anotherUserId = await provider.getOrCreateUserId('43', 'facebook');
    assert.equal(anotherUserId, '43');
    const context43 = await provider.getOrCreateContext('43', { });
    await context43.set('againAnotherVar', 'something');
    assert.equal(await context43.get('againAnotherVar'), 'something');

    await provider.mergeUserId('43', '42');

    assert.equal(await provider.getUserId('42', 'telegram'), '42');
    assert.equal(await provider.getUserId('43', 'facebook'), '42');
    assert.equal(await provider.getChatId('42', 'telegram'), '42');
    assert.equal(await provider.getChatId('42', 'facebook'), '43');

    const newContext = await provider.getOrCreateContext('42');
    assert.equal(await newContext.get('myVar'), 'guido');
    assert.equal(await newContext.get('anotherVar'), 'guidone');
  });

});

describe('Chat context provider memory', () => {
  const contextProviders = ContextProviders(RED);
  const getProvider = () => contextProviders.getProvider('memory', {
    chatbotId: 'my-bot'
  });

  beforeAll(async () => {
    const provider = getProvider();
    await provider.start();
  });

  afterAll(async () => {
  });

  beforeEach(async () => {
    const provider = getProvider();
    await provider.reset();
  });

  it('should create a context provider with some default params with userId', async () => {
    assert.isTrue(contextProviders.hasProvider('memory'));
    const provider = getProvider();
    assert.isFunction(provider.getOrCreate);
    assert.isFunction(provider.get);
    const chatContext = await provider.getOrCreateContext(44, { chatId: 43 });
    await chatContext.set({ myVariable: 'initial value' })
    assert.isFunction(chatContext.get);
    assert.isFunction(chatContext.set);
    assert.isFunction(chatContext.all);
    assert.isFunction(chatContext.remove);
    assert.isFunction(chatContext.clear);
    const myVariable = await chatContext.get('myVariable');
    assert.equal(myVariable, 'initial value');
  });

  it('should set some value and then get and remove it with userId', async () => {
    const provider = getProvider();
    const chatContext = await provider.getOrCreateContext(43, { userId: 43 });
    await chatContext.set('firstName', 'Guidone');
    let firstName = await chatContext.get('firstName');
    assert.equal(firstName, 'Guidone');
    await chatContext.remove('firstName')
    firstName = await chatContext.get('firstName');
    assert.isNull(firstName);
  });

  it('should set some values and then get and remove it with userId', async () => {
    const provider = getProvider();
    const chatContext = await provider.getOrCreateContext(43, { userId: 43 });
    await chatContext.set({firstName: 'Guido', lastName: 'Bellomo'});
    const firstName = await chatContext.get('firstName');
    assert.equal(firstName, 'Guido');
    const lastName = await chatContext.get('lastName');
    assert.equal(lastName, 'Bellomo');
    const json = await chatContext.get('firstName', 'lastName');
    assert.isObject(json);
    assert.equal(json.firstName, 'Guido');
    assert.equal(json.lastName, 'Bellomo');
  });

  it('should set some values and get the dump with userId', async () => {
    const provider = getProvider();
    const chatContext = await provider.getOrCreateContext(43, { userId: 43 });
    await chatContext.set({ firstName: 'Guido', lastName: 'Bellomo', email: 'spam@gmail.com' })
    const json = await chatContext.all();
    assert.isObject(json);
    assert.equal(json.firstName, 'Guido');
    assert.equal(json.lastName, 'Bellomo');
    assert.equal(json.email, 'spam@gmail.com');
  });

  it('should set some values and remove all with userId', async () => {
    const provider = getProvider();
    const chatContext = await provider.getOrCreateContext(43, { userId: 43 });
    await chatContext.set({ firstName: 'Guido', lastName: 'Bellomo' });
    await chatContext.clear();
    const json = await chatContext.all();
    assert.isObject(json);
    assert.isTrue(_.isEmpty(json));
  });

  it('should set some value the remove with multiple arguments', async () => {
    const provider = getProvider();
    const chatContext = await provider.getOrCreateContext(44, { chatId: 42 });
    await chatContext.set({ firstName: 'Guidone', lastName: 'Bellomo', email: 'some@email' });
    const firstName = await chatContext.get('firstName');
    assert.equal(firstName, 'Guidone');
    await chatContext.remove('firstName', 'lastName', 'email');
    const json = await chatContext.all();
    assert.isUndefined(json.firstName);
    assert.isUndefined(json.lastName);
    assert.isUndefined(json.email);
  });

  it('should set some value with chatId and userId', async () => {
    const provider = getProvider();
    let chatContext = await provider.getOrCreateContext(44, { userId: 44, chatId: 42 });
    await chatContext.set('firstName', 'Guidone');
    let firstName = await chatContext.get('firstName');
    assert.equal(firstName, 'Guidone');
    chatContext = await provider.getOrCreateContext(44, { userId: 44, chatId: 42 });
    assert.equal(await chatContext.get('userId'), 44);
    assert.equal(await chatContext.get('firstName'), 'Guidone');
    await chatContext.remove('firstName');
    firstName = await chatContext.get('firstName');
    assert.isNull(firstName);
  });

});
