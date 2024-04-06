using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ToyStore.Models
{
    [Table("Category")]
    public class Category
    {
        [Key]
        [Required(ErrorMessage = "Please enter a valid Id.")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Please enter the name of the category.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2 - 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter a description of the category.")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be 10 - 1000 characters.")]
        public string Description { get; set; }
    }
}