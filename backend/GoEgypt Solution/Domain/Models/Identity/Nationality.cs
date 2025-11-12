using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Identity
{
    public class Nationality
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();

    }
}
