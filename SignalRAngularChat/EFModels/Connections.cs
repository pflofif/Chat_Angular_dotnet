using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SignalRAngularChat.EFModels
{
    public partial class Connections
    {
        [Key]
        public Guid Id { get; set; }
        public Guid PersonId { get; set; }
        public string SignalrId { get; set; } = null!;
        public DateTime TimeStamp { get; set; }
    }
}
