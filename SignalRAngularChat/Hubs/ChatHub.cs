using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalRAngularChat.EFModels;
using SignalRAngularChat.HubsModels;

namespace SignalRAngularChat.Hubs;

public class ChatHub : Hub
{
    private readonly CharAngularDBContext _context;

    public ChatHub(CharAngularDBContext context)
    {
        _context = context;
    }

    public async Task RegisterMe(PersonInfo personInfo)
    {
        if (string.IsNullOrEmpty(personInfo.Username) ||
            string.IsNullOrEmpty(personInfo.password) ||
            string.IsNullOrEmpty(personInfo.realName))
        {
            await Clients.Caller.SendAsync("registerMeResponseFailEmptyFields");
            return;
        }

        var currentPerson = _context.Person
            .Any(p => p.Username == personInfo.Username && p.Password == personInfo.password);

        if (currentPerson)
        {
            await Clients.Caller.SendAsync("registerMeResponseFailPersonExist");
            return;

        }

        var person = new Person
        {
            Id = new Guid(),
            Name = personInfo.realName,
            Username = personInfo.Username,
            Password = personInfo.password
        };
        await _context.Person.AddAsync(person);
        await _context.SaveChangesAsync();

        await Clients.Caller.SendAsync("registerMeResponseSuccess", person);
    }
    public async Task AuthMe(PersonInfo personInfo)
    {
        var currentSignalRId = Context.ConnectionId;
        var currentPerson = _context.Person
            .FirstOrDefault(p => p.Username == personInfo.Username && p.Password == personInfo.password);

        if (currentPerson is not null)
        {
            var currentConnection = new Connections
            {
                Id = new Guid(),
                PersonId = currentPerson.Id,
                SignalrId = currentSignalRId,
                TimeStamp = DateTime.Now
            };
            await _context.Connections.AddAsync(currentConnection);
            await _context.SaveChangesAsync();

            await Clients.Caller.SendAsync("authMeResponseSuccess", currentPerson);
        }
        else
        {
            await Clients.Caller.SendAsync("authMeResponseFail", currentPerson);
        }
    }
}


